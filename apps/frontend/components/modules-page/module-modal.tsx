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
import { Module, useModules } from "@/components/modules-page/module-context";
import { DialogClose, DialogTitle } from "../ui/dialog";

type ModuleTutor = {
    id: number;
    name: string;
};

type Year = {
    id: number;
    name: string;
};

// module prop required if mode is edit
interface ModuleModalProps {
    type: "add" | "viewOrEdit";
    module?: Module;
}

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
    yearId: z
        .number({
            required_error: "Please select a year",
        })
        .int(),
    moduleTutorId: z.number({ invalid_type_error: "Value must be an integer" }).int().optional(),
});

const ModuleModal = ({ type, module }: ModuleModalProps) => {
    const { fetchModules } = useModules();
    const [moduleTutors, setModuleTutors] = useState<ModuleTutor[]>([]);
    const [years, setyears] = useState<Year[]>([]);
    const [isModuleTutorPopoverOpen, setIsModuleTutorPopoverOpen] = useState(false);
    const [isYearPopoverOpen, setIsYearPopoverOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(type === "add" ? true : false);

    useEffect(() => {
        const fetchModuleTutors = async () => {
            const res = await protectedFetch("/users", "GET");
            const moduleTutors = res.data.map((moduleTutor: { id: number; firstName: string; lastName: string }) => ({ ...moduleTutor, name: moduleTutor.firstName + " " + moduleTutor.lastName }));
            setModuleTutors(moduleTutors);
        };

        const fetchYears = async () => {
            const res = await protectedFetch("/years", "GET");
            const years = res.data.map((year: { id: number; name: string }) => year);
            setyears(years);
        };
        fetchModuleTutors();
        fetchYears();
    }, []);

    console.log(module);
    const getFormSchema = () => {
        if (type === "add") {
            return {
                moduleCode: "",
                moduleName: "",
                yearId: undefined,
                moduleTutorId: undefined,
            };
        } else if (type === "viewOrEdit") {
            return {
                moduleCode: module?.code || "",
                moduleName: module?.name || "",
                yearId: module?.yearId,
                moduleTutorId: module?.leadId,
            };
        }
    };

    // Define form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: getFormSchema(),
    });

    const buttons = () => {
        if (type === "viewOrEdit") {
            return isEditing ? (
                <div className="flex space-x-4">
                    <Button type="submit">Save changes</Button>
                    <Button
                        onClick={() => {
                            form.reset(getFormSchema()); // Reset to initial values
                            setIsEditing(false);
                        }}
                        variant="outline"
                    >
                        Back
                    </Button>
                </div>
            ) : (
                <div className="flex space-x-4">
                    <Button
                        onClick={(e) => {
                            e.preventDefault(); // prevent form submission
                            setIsEditing(true);
                        }}
                    >
                        Edit
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </div>
            );
        } else if (type === "add") {
            return (
                <div className="flex space-x-4">
                    <Button type="submit">Add</Button>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                </div>
            );
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const body = { id: module.id, code: values.moduleCode, name: values.moduleName, yearId: values.yearId, moduleLeadId: values.moduleTutorId };
        console.log(body);
        let res;

        if (type === "viewOrEdit") {
            res = await protectedFetch(`/modules/`, "PATCH", body);
        } else if (type === "add") {
            res = await protectedFetch("/modules", "POST", body);
        }

        if (res && res.status === 500 && res.data.errorCode === "P2002") {
            form.setError("moduleCode", {
                type: "manual",
                message: "Module with the given ID already exists",
            });
        } else {
            fetchModules();
        }
    };
    return (
        <>
            <DialogTitle>{type === "add" ? "Add new module" : isEditing ? "Edit module information" : "View module information"}</DialogTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="moduleCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Module Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g AB1CDE" {...field} readOnly={!isEditing} />
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
                                    <Input placeholder="e.g. System Design" {...field} readOnly={!isEditing} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="yearId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Module Lead</FormLabel>
                                <Popover open={isYearPopoverOpen} onOpenChange={setIsYearPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} disabled={!isEditing}>
                                                {field.value ? `${years.find((year: Year) => year.id === field.value)?.name}` : "Select year"}
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
                                                    {years.map((year: Year) => (
                                                        <CommandItem
                                                            value={year.name}
                                                            key={year.id}
                                                            onSelect={() => {
                                                                form.setValue("yearId", year.id);
                                                                setIsYearPopoverOpen(false);
                                                            }}
                                                        >
                                                            {year.name}
                                                            <Check className={cn("ml-auto", year.id === field.value ? "opacity-100" : "opacity-0")} />
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
                    <FormField
                        control={form.control}
                        name="moduleTutorId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Module Lead</FormLabel>
                                <Popover open={isModuleTutorPopoverOpen} onOpenChange={setIsModuleTutorPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} disabled={!isEditing}>
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
                                                                setIsModuleTutorPopoverOpen(false);
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

                    {buttons()}
                </form>
            </Form>
        </>
    );
};

export default ModuleModal;
