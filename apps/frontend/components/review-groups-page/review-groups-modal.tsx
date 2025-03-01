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
import { ReviewGroup, useReviewGroups } from "@/components/review-groups-page/review-groups-context";
import { DialogClose, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import { ModuleAPIResponse } from "@/components/modules-page/module-context";
import ModulesMultiSelect from "@/components/review-groups-page/modules-multi-select";
import { ModuleTutor } from "../modules-page/module-modal";
import ModalAlert from "../modal-alert";

export type ReviewGroupTutor = {
    id: number;
    name: string;
};

//extend module api type
type Module = ModuleAPIResponse & {
    longName: string;
};

type Year = {
    id: number;
    name: string;
};

// reviewGroup prop required if mode is edit
interface ReviewGroupModalProps {
    type: "add" | "viewOrEdit";
    reviewGroupId?: number;
}

const formSchema = z.object({
    yearId: z.number({ required_error: "Please select a year" }).int(),
    //array of numbers of size at least 1
    moduleIds: z.array(z.number().int()).nonempty({ message: "Please select at least one module" }),
    convener: z.number({ required_error: "Please select a convener" }).int(),
});

const ReviewGroupModal = ({ type, reviewGroupId }: ReviewGroupModalProps) => {
    const { fetchReviewGroups, reviewGroups } = useReviewGroups();
    const [reviewGroupTutors, setReviewGroupTutors] = useState<ReviewGroupTutor[]>([]);
    const [years, setyears] = useState<Year[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [isYearPopoverOpen, setIsYearPopoverOpen] = useState(false);
    const [isConvenerPopoverOpen, setIsConvenerPopoverOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(type === "add" ? true : false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const formSchemaRefined = formSchema
        .refine(
            (data) => {
                return modules.find((module) => module.id === data.yearId);
            },
            { message: "Selected modules must match the selected year" }
        )
        .refine(
            (data) => {
                return reviewGroupTutors.find((reviewGroupTutor) => reviewGroupTutor.id === data.convener);
            },
            { message: "Selected convener must be a module tutor/lead of the selected modules" }
        );

    useEffect(() => {
        const fetchReviewGroupTutors = async () => {
            const res = await protectedFetch("/users", "GET");
            const reviewGroupTutors = res.data.map((reviewGroupTutor: { id: number; firstName: string; lastName: string }) => ({ ...reviewGroupTutor, name: reviewGroupTutor.firstName + " " + reviewGroupTutor.lastName }));
            setReviewGroupTutors(reviewGroupTutors);
        };

        const fetchModules = async () => {
            const res = await protectedFetch("/modules", "GET");
            const modules = res.data.map((module: { id: number; code: string; name: string; yearId: number; moduleLeadId: number; moduleTutorIds: number[] }) => module);
            // add another custom field to the modules list, called longName wich is name + code
            const modulesWithLongName = modules.map((module: Module) => ({ ...module, longName: `${module.name} (${module.code})` }));
            setModules(modulesWithLongName);
        };

        const fetchYears = async () => {
            const res = await protectedFetch("/years", "GET");
            const years = res.data.map((year: { id: number; name: string }) => year);
            setyears(years);
        };
        fetchReviewGroupTutors();
        fetchModules();
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
                yearId: undefined,
                moduleIds: [],
                convener: undefined,
            };
        } else if (type === "viewOrEdit") {
            const currentReviewGroup = reviewGroups.find((reviewGroup: ReviewGroup) => reviewGroup.id === reviewGroupId);

            return {
                yearId: currentReviewGroup?.yearId,
                moduleIds: currentReviewGroup?.modules.map((module) => module.id),
                convener: currentReviewGroup?.convener,
            };
        }
    };

    useEffect(() => {
        if (type === "viewOrEdit") {
            form.reset(getFormSchema());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewGroups]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchemaRefined),
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
        const body = { yearId: values.yearId, moduleIds: values.moduleIds, convener: values.convener };
        let res;

        if (type === "viewOrEdit") {
            res = await protectedFetch(`/review-groups/`, "PATCH", body);
        } else if (type === "add") {
            res = await protectedFetch("/review-groups", "POST", body);
        }

        if (res && res.status !== 200) {
            setShowError(true);
        } else {
            setShowSuccess(true);
            fetchReviewGroups();
            setIsEditing(false);
        }
    };
    return (
        <>
            <DialogTitle>{type === "add" ? "Create new review group" : isEditing ? "Edit reviewGroup information" : "View reviewGroup information"}</DialogTitle>
            {showSuccess && <ModalAlert type="success" message="Review group has been created successfully" />}
            {showError && <ModalAlert type="error" message="Something went wrong" />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="yearId"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Year</FormLabel>
                                <Popover open={isYearPopoverOpen} onOpenChange={setIsYearPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${years.find((year: Year) => year.id === field.value)?.name}` : "Select year"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 -mt-2">
                                        <Command>
                                            <CommandList>
                                                <CommandEmpty>No tutors found.</CommandEmpty>
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
                        name="moduleIds"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Modules</FormLabel>
                                <ModulesMultiSelect data={modules.filter((module) => module.year.id === form.watch("yearId"))} field={{ ...field, value: field.value || [] }} isEditing={isEditing} selectedYearId={form.watch("yearId")} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="convener"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Convener</FormLabel>
                                <Popover open={isConvenerPopoverOpen} onOpenChange={setIsConvenerPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${reviewGroupTutors.find((tutor: ModuleTutor) => tutor.id === field.value)?.name}` : "Select convener"}
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
                                                        reviewGroupTutors
                                                            .filter(
                                                                (tutor) =>
                                                                    modules
                                                                        .filter((module) => form.watch("moduleIds").includes(module.id)) // Get selected modules
                                                                        .some((module) => module.moduleLead.id === tutor.id) // Check if tutor is a module lead
                                                            )
                                                            .map((tutor) => (
                                                                <CommandItem
                                                                    value={tutor.name}
                                                                    key={tutor.id}
                                                                    onSelect={() => {
                                                                        form.setValue("convener", tutor.id);
                                                                        setIsConvenerPopoverOpen(false);
                                                                    }}
                                                                >
                                                                    {tutor.name}
                                                                    <Check className={cn("ml-auto", tutor.id === field.value ? "opacity-100" : "opacity-0")} />
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

export default ReviewGroupModal;
