"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { protectedFetch } from "@/utils/protected-fetch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModules } from "@/components/modules-page/module-context";

type ModuleTutor = {
    id: number;
    name: string;
};

const formSchema = z.object({
    moduleCode: z
        .string()
        .min(1, {
            message: "This field is required",
        })
        .refine((s) => !s.includes(" "), "Module code cannot have spaces"),
    moduleName: z.string().min(1, {
        message: "This field is required",
    }),
    year: z
        .number({
            required_error: "Please select a year",
        })
        .int(),
    moduleTutorId: z.number({ invalid_type_error: "Value must be an integer" }).int().optional(),
});

const AddModuleModal = () => {
    const { fetchModules } = useModules();
    const [moduleTutors, setModuleTutors] = useState<ModuleTutor[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false); // Add this state

    useEffect(() => {
        // Fetch module tutors
        const fetchModuleTutors = async () => {
            const res = await protectedFetch("/users", "GET");
            const moduleTutors = res.data.map((moduleTutor: { id: number; firstName: string; lastName: string }) => ({ ...moduleTutor, name: moduleTutor.firstName + " " + moduleTutor.lastName }));
            setModuleTutors(moduleTutors);
        };
        fetchModuleTutors();
    }, []);

    // Define form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            moduleCode: "",
            moduleName: "",
            year: 1,
            moduleTutorId: undefined,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const body = { id: values.moduleCode, name: values.moduleName, year: values.year, moduleLeadId: values.moduleTutorId };
        const res = await protectedFetch("/modules", "POST", body);

        if (res.status === 500 && res.data.errorCode === "P2002") {
            form.setError("moduleCode", {
                type: "manual",
                message: "Module with the given ID already exists",
            });
        } else {
            fetchModules();
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="moduleCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Module Code</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g AB1CDE" {...field} />
                            </FormControl>
                            {/*<FormDescription>This is your public display name.</FormDescription>*/}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="moduleName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Module Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. System Design" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="e.g. Year 1" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="1">Year 1</SelectItem>
                                    <SelectItem value="2">year 2</SelectItem>
                                    <SelectItem value="3">Year 3</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="moduleTutorId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Module Lead</FormLabel>
                            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? `${moduleTutors.find((moduleTutor: ModuleTutor) => moduleTutor.id === field.value)?.name}` : "Select module tutor"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 -mt-2">
                                    <Command>
                                        <CommandInput placeholder="Search module tutor..." />
                                        <CommandList>
                                            <CommandEmpty>No module tutors found.</CommandEmpty>
                                            <CommandGroup>
                                                {moduleTutors.map((moduleTutor: ModuleTutor) => (
                                                    <CommandItem
                                                        value={moduleTutor.name}
                                                        key={moduleTutor.id}
                                                        onSelect={() => {
                                                            form.setValue("moduleTutorId", moduleTutor.id);
                                                            setIsPopoverOpen(false);
                                                        }}
                                                    >
                                                        {moduleTutor.name}
                                                        <Check className={cn("ml-auto", moduleTutor.id === field.value ? "opacity-100" : "opacity-0")} />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
};

export default AddModuleModal;
