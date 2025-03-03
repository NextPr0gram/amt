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
import { DialogClose, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import MultiSelect from "../multi-select";
import ModalAlert from "../modal-alert";
import { Module } from "../modules-page/module-context";

// module prop required if mode is edit
interface ModuleModalProps {
    type: "add" | "viewOrEdit";
    moduleId?: number;
}

interface AssessmentType {
    id: number;
    name: string;
}
interface AssessmentCategory {
    id: number;
    name: string;
}

const formSchema = z.object({
    moduleId: z.number().int(),
    typeId: z.number().int(),
    categoryId: z.number().int(),
    weight: z.number().int(),
    releaseDate: z.string().optional(),
    submissionDate: z.string().optional(),
    durationInMinutes: z.number().int(),
});

const AssessmentModal = ({ type, assessmentId }: ModuleModalProps) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
    const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
    const [isModulePopoverOpen, setIsModulePopoverOpen] = useState(false);
    const [isTypePopoverOpen, setIsTypePopoverOpen] = useState(false);
    const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(type === "add" ? true : false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const fetchModules = async () => {
            const res = await protectedFetch("/modules", "GET");
            setModules(res.data);
        };

        const fetchAssessmentTypes = async () => {
            const res = await protectedFetch("/assessments/types", "GET");
            setAssessmentTypes(res.data);
        };

        const fetchAssessmentCategories = async () => {
            const res = await protectedFetch("/assessment/categories", "GET");
            setAssessmentCategories(res.data);
        };
        fetchModules();
        fetchAssessmentTypes();
        fetchAssessmentCategories();
    }, [setModules]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showSuccess) {
            timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [showSuccess]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showError) {
            timer = setTimeout(() => {
                setShowError(false);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [showError]);

    const getFormSchema = () => {
        if (type === "add") {
            return {
                moduleId: undefined,
                typeId: undefined,
                categoryId: undefined,
                weight: undefined,
                releaseDate: "",
                submissionDate: "",
                durationInMinutes: undefined,
            };
        } else if (type === "viewOrEdit") {
            const currentModule = modules.find((module: Module) => module.id === moduleId);

            return {
                moduleId: undefined,
                typeId: undefined,
                categoryId: undefined,
                weight: undefined,
                releaseDate: "",
                submissionDate: "",
                durationInMinutes: undefined,
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
                    <Button disabled={!isEditing} size="sm" type="submit">
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
        if (modules.some((module: Module) => module.code === values.moduleCode)) {
            form.setError("moduleCode", {
                type: "manual",
                message: "Module with the given code already exists",
            });
            return;
        }
        const body = { id: moduleId, code: values.moduleCode, name: values.moduleName, yearId: values.yearId, moduleLeadId: values.moduleTutorId, moduleTutors: values.moduleTutors };
        let res;

        if (type === "viewOrEdit") {
            res = await protectedFetch(`/modules/`, "PATCH", body);
        } else if (type === "add") {
            res = await protectedFetch("/modules", "POST", body);
        }

        if (res && res.status !== 200) {
            setShowSuccess(false);
            setShowError(true);
            setIsEditing(true);
        } else {
            setShowError(false);
            setShowSuccess(true);
            fetchModules();
            setIsEditing(false);
        }
    };
    return (
        <>
            <DialogTitle>{type === "add" ? "Add new assessment" : isEditing ? "Edit assessment information" : "View assessment information"}</DialogTitle>
            {showSuccess && <ModalAlert type="success" message={type === "add" ? "Assessment created successfully" : "Assessment updated successfully"} />}
            {showError && <ModalAlert type="error" message="Something went wrong" />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="moduleId"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Module</FormLabel>
                                <Popover open={isModulePopoverOpen} onOpenChange={setIsModulePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${modules.find((module) => module.id === field.value)?.code} - ${modules.find((module) => module.id === field.value)?.name}` : "Select module"}
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
                                                        modules.map((module) => (
                                                            <CommandItem
                                                                key={module.id}
                                                                onSelect={() => {
                                                                    form.setValue("moduleId", module.id);
                                                                    setIsModulePopoverOpen(false);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                {`${module.code} - ${module.name}`}
                                                                <Check className={cn("ml-auto", module.id === field.value ? "opacity-100" : "opacity-0")} />
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
                        name="typeId"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Assessment Type</FormLabel>
                                <Popover open={isTypePopoverOpen} onOpenChange={setIsTypePopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${assessmentTypes.find((type) => type.id === field.value)?.name}` : "Select type"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 -mt-2">
                                        <Command>
                                            <CommandInput placeholder="Search module tutor..." />
                                            <CommandList>
                                                <CommandEmpty>No types found.</CommandEmpty>
                                                <CommandGroup>
                                                    {isEditing &&
                                                        assessmentTypes.map((type) => (
                                                            <CommandItem
                                                                key={type.id}
                                                                onSelect={() => {
                                                                    form.setValue("typeId", type.id);
                                                                    setIsTypePopoverOpen(false);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                {type.name}
                                                                <Check className={cn("ml-auto", type.id === field.value ? "opacity-100" : "opacity-0")} />
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

export default AssessmentModal;
