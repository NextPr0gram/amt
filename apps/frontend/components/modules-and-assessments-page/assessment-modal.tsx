"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { protectedFetch } from "@/utils/protected-fetch";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, CheckCircle2, ChevronsUpDown, HelpCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogClose, DialogTitle } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";
import MultiSelect from "../multi-select";
import ModalAlert from "../modal-alert";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Assessment, useAssessments } from "./assessment-context";
import { Value } from "@radix-ui/react-select";
import { useModules } from "./module-context";

// module prop required if mode is edit
interface AssessmentModalProps {
    type: "add" | "viewOrEdit";
    assessmentId?: number;
}

export interface AssessmentType {
    id: number;
    name: string;
}

export interface AssessmentCategory {
    id: number;
    name: string;
}

export interface AssessmentTps {
    tp: {
        id: number;
        name: string;

    }
}

const formSchema = z.object({
    moduleId: z.number().int(),
    tpId: z.number().int(),
    typeId: z.number().int(),
    categoryId: z.number().int(),
    weight: z.number(),
    durationInMinutes: z.number().int().optional(),
});

const AssessmentModal = ({ type, assessmentId }: AssessmentModalProps) => {
    const { fetchAssessments, assessments } = useAssessments();
    const { fetchModules, modules } = useModules();
    const [selectedModule, setSelectedModule] = useState<Module>();
    const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
    const [assessmentCategories, setAssessmentCategories] = useState<AssessmentCategory[]>([]);
    const [assessmentTps, setAssessmentTps] = useState<AssessmentTps[]>([]);
    const [isModulePopoverOpen, setIsModulePopoverOpen] = useState(false);
    const [isAssessmentTpsPopoverOpen, setIsAssessmentTpsPopoverOpen] = useState(false);
    const [isTypePopoverOpen, setIsTypePopoverOpen] = useState(false);
    const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(type === "add" ? true : false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [remainingWeight, setRemainingWeight] = useState<number | null>(null);

    useEffect(() => {
        const fetchRemainingWeight = async () => {
            const moduleId = form.watch("moduleId");
            if (moduleId) {
                const res = await protectedFetch(`/assessments/get-remaining-weight?moduleId=${moduleId}`, "GET")
                if (res.status === 200) {
                    setRemainingWeight(res.data.remainingWeight)
                }
            }
        }
        fetchRemainingWeight()
    }, [selectedModule]);

    useEffect(() => {
        const fetchModuleTps = async () => {
            if (selectedModule) {
                const res = await protectedFetch(`/modules/module-tps?moduleId=${selectedModule.id
                    }`, "GET")
                setAssessmentTps(res.data)
            }
        }

        fetchModuleTps();
        form.setValue("tpId", undefined);
    }, [selectedModule, setSelectedModule])

    useEffect(() => {
        fetchModules()
        if (type === "viewOrEdit") {
            const currentAssessment = assessments.find((assessment: Assessment) => assessment.id === assessmentId);
            setSelectedModule(modules.find((md) => md.id === currentAssessment?.moduleId))
        }


        const fetchAssessmentTypes = async () => {
            const res = await protectedFetch("/assessments/types", "GET");
            setAssessmentTypes(res.data);
        };

        const fetchAssessmentCategories = async () => {
            const res = await protectedFetch("/assessments/categories", "GET");
            setAssessmentCategories(res.data);
        };
        fetchAssessmentTypes();
        fetchAssessmentCategories();
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
                moduleId: undefined,
                tpId: undefined,
                typeId: undefined,
                categoryId: undefined,
                weight: undefined,
                releaseDate: "",
                submissionDate: "",
                durationInMinutes: undefined,
            };
        } else if (type === "viewOrEdit") {
            const currentAssessment = assessments.find((assessment: Assessment) => assessment.id === assessmentId);

            return {
                moduleId: currentAssessment?.moduleId,
                tpId: currentAssessment?.tpId,
                typeId: currentAssessment?.assessmentTypeId,
                categoryId: currentAssessment?.assessmentCategoryId,
                weight: currentAssessment?.weight,
                durationInMinutes: currentAssessment?.durationInMinutes,
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
        const body = { id: assessmentId, moduleId: values.moduleId, tpId: values.tpId, typeId: values.typeId, categoryId: values.categoryId, weight: values.weight, durationInMinutes: values.durationInMinutes };
        let res;

        if (type === "viewOrEdit") {
            res = await protectedFetch(`/assessments`, "PATCH", body);
        } else if (type === "add") {
            res = await protectedFetch("/assessments", "POST", body);
        }

        if (res && res.status !== 200) {
            setShowSuccess(false);
            setShowError(true);
            setIsEditing(true);
        } else {
            setShowError(false);
            setShowSuccess(true);
            fetchAssessments();
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
                                                                    setSelectedModule(modules.find((md) => md.id === module.id))
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
                        name="tpId"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>TP</FormLabel>
                                <Popover open={isAssessmentTpsPopoverOpen} onOpenChange={setIsAssessmentTpsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${assessmentTps.find((tp) => tp.tp.id === field.value)?.tp.name}` : "Select TP"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 -mt-2">
                                        <Command>
                                            <CommandInput placeholder="Search tp..." />
                                            <CommandList>
                                                <CommandEmpty>No TPs found.</CommandEmpty>
                                                <CommandGroup>
                                                    {isEditing &&
                                                        assessmentTps?.map((tp) => (
                                                            <CommandItem
                                                                key={tp.tp.id}
                                                                onSelect={() => {
                                                                    form.setValue("tpId", tp.tp.id);
                                                                    setIsAssessmentTpsPopoverOpen(false);
                                                                }}
                                                                className="cursor-pointer"
                                                            >
                                                                {tp.tp.name}
                                                                <Check className={cn("ml-auto", tp.tp.id === field.value ? "opacity-100" : "opacity-0")} />
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
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className={cn("flex flex-col", !isEditing && "pointer-events-none")}>
                                <FormLabel>Assessment Category</FormLabel>
                                <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button size="sm" variant="outline" role="combobox" className={cn("justify-between font-normal", !field.value && "text-muted-foreground")} tabIndex={isEditing ? 0 : -1}>
                                                {field.value ? `${assessmentCategories.find((type) => type.id === field.value)?.name}` : "Select category"}
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
                                                        assessmentCategories.map((type) => (
                                                            <CommandItem
                                                                key={type.id}
                                                                onSelect={() => {
                                                                    form.setValue("categoryId", type.id);
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
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Weight in % {remainingWeight !== null && `(Remaining weight: ${remainingWeight})`}
                                </FormLabel>
                                <FormControl>
                                    <Input className={cn(!isEditing && "pointer-events-none")} tabIndex={isEditing ? 0 : -1} type="number" placeholder="e.g. 20" value={Math.round((field.value ?? 0) * 100)} onChange={(e) => form.setValue("weight", parseFloat(e.target.value) / 100)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="durationInMinutes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration in Minutes (optional) </FormLabel>
                                <FormControl>
                                    <Input className={cn(!isEditing && "pointer-events-none")} tabIndex={isEditing ? 0 : -1} type="number" placeholder="e.g. 120" value={field.value ?? undefined} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)} />
                                </FormControl>
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
