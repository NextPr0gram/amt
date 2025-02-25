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
import { Check, CheckCircle2, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Module, useModules } from "@/components/modules-page/module-context";
import { DialogClose, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import MultiSelect from "../multi-select";

export type ModuleTutor = {
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
    moduleId: number;
}

const formSchema = z
    .object({
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
        moduleTutorId: z.number({ invalid_type_error: "Value must be an integer" }).int().optional(), // represents module lead id
        // module tutors must be array of numbers and the modulettorid cannot be in the array
        moduleTutors: z.array(z.number({ invalid_type_error: "Values must be integers" })).optional(),
    })
    .refine(
        (data) => {
            if (!data.moduleTutors) return true; // If undefined, skip validation
            if (data.moduleTutorId === undefined) return true; // If no module lead, skip validation
            return !data.moduleTutors.includes(data.moduleTutorId);
        },
        { message: "Module tutors list cannot contain the module lead", path: ["moduleTutors"] }
    );

const ModuleModal = ({ type, moduleId }: ModuleModalProps) => {
    const { fetchModules, modules } = useModules();
    const [moduleTutors, setModuleTutors] = useState<ModuleTutor[]>([]);
    const [years, setyears] = useState<Year[]>([]);
    const [isModuleTutorPopoverOpen, setIsModuleTutorPopoverOpen] = useState(false);
    const [isYearPopoverOpen, setIsYearPopoverOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(type === "add" ? true : false);
    const [showSuccess, setShowSuccess] = useState(false);

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

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showSuccess) {
            timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [showSuccess]);

    const getFormSchema = () => {
        if (type === "add") {
            return {
                moduleCode: "",
                moduleName: "",
                yearId: undefined,
                moduleTutorId: undefined,
                moduleTutors: [],
            };
        } else if (type === "viewOrEdit") {
            const currentModule = modules.find((module: Module) => module.id === moduleId);

            return {
                moduleCode: currentModule?.code || "",
                moduleName: currentModule?.name || "",
                yearId: currentModule?.yearId || undefined,
                moduleTutorId: currentModule?.leadId || undefined,
                moduleTutors: currentModule?.moduleTutorIds || [],
            };
        }
    };

    useEffect(() => {
        if (type === "viewOrEdit") {
            form.reset(getFormSchema());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modules]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: getFormSchema(),
    });

    const buttons = () => {
        if (type === "viewOrEdit") {
            return isEditing ? (
                <div className="flex space-x-4 item">
                    <Button size="sm" type="submit">
                        Save changes
                    </Button>
                    <Button
                        size="sm"
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
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault(); // prevent form submission
                            setIsEditing(true);
                        }}
                    >
                        Edit
                    </Button>
                    <DialogClose asChild>
                        <Button size="sm" variant="outline">
                            Close
                        </Button>
                    </DialogClose>
                </div>
            );
        } else if (type === "add") {
            return (
                <div className="flex space-x-4">
                    <Button size="sm" type="submit">
                        Add
                    </Button>
                    <DialogClose asChild>
                        <Button size="sm" variant="outline">
                            Close
                        </Button>
                    </DialogClose>
                </div>
            );
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const body = { id: moduleId, code: values.moduleCode, name: values.moduleName, yearId: values.yearId, moduleLeadId: values.moduleTutorId, moduleTutors: values.moduleTutors };
        let res;

        if (type === "viewOrEdit") {
            res = await protectedFetch(`/modules/`, "PATCH", body);
        } else if (type === "add") {
            res = await protectedFetch("/modules", "POST", body);
        }

        if (res && res.status !== 200) {
            if (res.status === 500 && res.data.errorCode === "P2002") {
                form.setError("moduleCode", {
                    type: "manual",
                    message: "Module with the given ID already exists",
                });
            }
        } else {
            setShowSuccess(true);
            fetchModules();
            setIsEditing(false);
        }
    };
    return (
        <>
            <DialogTitle>{type === "add" ? "Add new module" : isEditing ? "Edit module information" : "View module information"}</DialogTitle>
            {showSuccess && (
                <Alert className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Module has been added successfully.</AlertDescription>
                </Alert>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="moduleCode"
                        render={({ field }) => (
                            <FormItem className={cn(!isEditing && "pointer-events-none")}>
                                <FormLabel>Module Code</FormLabel>
                                <FormControl>
                                    <Input  {...field} placeholder="e.g AB1CDE" readOnly={!isEditing} tabIndex={isEditing ? 0 : -1}/>
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
                            <FormItem className={cn(!isEditing && "pointer-events-none")}>
                                <FormLabel>Module Name</FormLabel>
                                <FormControl>
                                    <Input  placeholder="e.g. System Design" {...field} readOnly={!isEditing} tabIndex={isEditing ? 0 : -1}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="yearId"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Year</FormLabel>
                                <Popover open={isYearPopoverOpen} onOpenChange={setIsYearPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button  size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${years.find((year: Year) => year.id === field.value)?.name}` : "Select year"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 -mt-2">
                                        <Command>
                                            <CommandList>
                                                <CommandEmpty>No module tutors found.</CommandEmpty>
                                                <CommandGroup>
                                                    {isEditing &&
                                                        years.map((year: Year) => (
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
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Module Lead</FormLabel>
                                <Popover open={isModuleTutorPopoverOpen} onOpenChange={setIsModuleTutorPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${moduleTutors.find((moduleTutor: ModuleTutor) => moduleTutor.id === field.value)?.name}` : "Assign module lead"}
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
                                                    {isEditing &&
                                                        moduleTutors.map((moduleTutor: ModuleTutor) => (
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
                    <FormField
                        control={form.control}
                        name="moduleTutors"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Module Tutors</FormLabel>
                                <MultiSelect data={moduleTutors} field={{ ...field, value: field.value || [] }} isEditing={isEditing} />
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
