"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, MoveRight } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { protectedFetch } from "@/utils/protected-fetch";
import { Loader } from "../ui/loader";
import { Card, CardContent } from "../ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const formSchema = z
    .object({
        internalModerationTp1: z.date({
            required_error: "A date is required.",
        }),
        externalModerationTp1: z.date({
            required_error: "A date is required.",
        }),
        finalDeadlineTp1: z.date({
            required_error: "A date is required.",
        }),
        internalModerationTp2: z.date({
            required_error: "A date is required.",
        }),
        externalModerationTp2: z.date({
            required_error: "A date is required.",
        }),
        finalDeadlineTp2: z.date({
            required_error: "A date is required.",
        }),
    })
    .refine(
        (data) => {
            return data.internalModerationTp1.getTime() <= data.externalModerationTp1.getTime();
        },
        {
            message: "Internal moderation deadline (TP1) must be before external moderation deadline",
            path: ["internalModerationTp1"],
        }
    )
    .refine(
        (data) => {
            return data.externalModerationTp1.getTime() <= data.finalDeadlineTp1.getTime();
        },
        {
            message: "External moderation deadline (TP1) must be before final deadline",
            path: ["externalModerationTp1"],
        }
    )
    .refine(
        (data) => {
            return data.internalModerationTp2.getTime() <= data.externalModerationTp2.getTime();
        },
        {
            message: "Internal moderation deadline (TP2) must be before external moderation deadline",
            path: ["internalModerationTp2"],
        }
    )
    .refine(
        (data) => {
            return data.externalModerationTp2.getTime() <= data.finalDeadlineTp2.getTime();
        },
        {
            message: "External moderation deadline (TP2) must be before final deadline",
            path: ["externalModerationTp2"],
        }
    );

export const DeadlinesForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [originalValues, setOriginalValues] = useState<Record<string, Date>>({});

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const formValues = form.watch();

    const changedFields = Object.keys(formValues).reduce((acc, key) => {
        if (originalValues[key] && formValues[key]) {
            acc[key] = originalValues[key].getTime() !== (formValues[key] as Date).getTime();
        }
        return acc;
    }, {} as Record<string, boolean>);

    const fetchDeadlines = async () => {
        setIsLoading(true);
        try {
            const res = await protectedFetch("/moderation/status", "GET");

            if (res.status === 200 && res.data) {
                const internalDateTp1 = res.data.internalModerationDeadlineTp1;
                const externalDateTp1 = res.data.externalModerationDeadlineTp1;
                const finalDateTp1 = res.data.finalDeadlineTp1;

                const internalDateTp2 = res.data.internalModerationDeadlineTp2;
                const externalDateTp2 = res.data.externalModerationDeadlineTp2;
                const finalDateTp2 = res.data.finalDeadlineTp2;

                const formData = {
                    internalModerationTp1: new Date(internalDateTp1),
                    externalModerationTp1: new Date(externalDateTp1),
                    finalDeadlineTp1: new Date(finalDateTp1),
                    internalModerationTp2: new Date(internalDateTp2),
                    externalModerationTp2: new Date(externalDateTp2),
                    finalDeadlineTp2: new Date(finalDateTp2),
                };

                form.reset(formData);

                setOriginalValues(formData);
            } else {
                setNotFound(true);
                toast.error("Failed to load deadlines");
            }
        } catch (error) {
            setNotFound(true);

            toast.error("Error loading deadlines", {
                description: "Please try again later",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDeadlines();
    }, [form]);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsSaving(true);

        try {
            const internalTp1Response = await protectedFetch("/moderation/deadlines/internal-tp1", "PATCH", { deadlineDate: data.internalModerationTp1.toISOString() });
            const externalTp1Response = await protectedFetch("/moderation/deadlines/external-tp1", "PATCH", { deadlineDate: data.externalModerationTp1.toISOString() });
            const finalTp1Response = await protectedFetch("/moderation/deadlines/final-tp1", "PATCH", { deadlineDate: data.finalDeadlineTp1.toISOString() });

            const internalTp2Response = await protectedFetch("/moderation/deadlines/internal-tp2", "PATCH", { deadlineDate: data.internalModerationTp2.toISOString() });
            const externalTp2Response = await protectedFetch("/moderation/deadlines/external-tp2", "PATCH", { deadlineDate: data.externalModerationTp2.toISOString() });
            const finalTp2Response = await protectedFetch("/moderation/deadlines/final-tp2", "PATCH", { deadlineDate: data.finalDeadlineTp2.toISOString() });

            if (internalTp1Response.status === 200 && externalTp1Response.status === 200 && finalTp1Response.status === 200 && internalTp2Response.status === 200 && externalTp2Response.status === 200 && finalTp2Response.status === 200) {
                toast.success("Deadlines updated successfully");
                fetchDeadlines();
            } else {
                toast.error("Failed to update some deadlines");
            }
        } catch (error) {
            toast.error("Error updating deadlines", {
                description: "Please try again later",
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (notFound) {
        return <div className="text-sm flex items-center justify-center p-6">Could not fetch data</div>;
    }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-6">
                <Loader className="mx-auto" variant="circular" />
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="text-sm pt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full max-w-sm gap-6">
                        <h4 className="">TP 1 Deadlines</h4>
                        <FormField
                            control={form.control}
                            name="internalModerationTp1"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Internal moderation deadline</FormLabel>
                                    <div className="relative">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", changedFields.internalModerationTp1 && "bg-yellow-50 border-yellow-300")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <div className="flex items-center justify-end ml-auto gap-x-2">
                                                            {changedFields.internalModerationTp1 && <div className=" h-2 w-2 rounded-full bg-yellow-400" title="This date has been changed"></div>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </div>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar month={field.value} mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {changedFields.internalModerationTp1 && originalValues.internalModerationTp1 && <p className="text-xs text-yellow-600 mt-1">Changed from: {format(originalValues.internalModerationTp1, "PPP")}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="externalModerationTp1"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>External moderation deadline</FormLabel>
                                    <div className="relative">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", changedFields.externalModerationTp1 && "bg-yellow-50 border-yellow-300")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <div className="flex items-center justify-end ml-auto gap-x-2">
                                                            {changedFields.externalModerationTp1 && <div className=" h-2 w-2 rounded-full bg-yellow-400" title="This date has been changed"></div>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </div>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar month={field.value} mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {changedFields.externalModerationTp1 && originalValues.externalModerationTp1 && <p className="text-xs text-yellow-600 mt-1">Changed from: {format(originalValues.externalModerationTp1, "PPP")}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="finalDeadlineTp1"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Final deadline</FormLabel>
                                    <div className="relative">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", changedFields.finalDeadlineTp1 && "bg-yellow-50 border-yellow-300")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <div className="flex items-center justify-end ml-auto gap-x-2">
                                                            {changedFields.finalDeadlineTp1 && <div className=" h-2 w-2 rounded-full bg-yellow-400" title="This date has been changed"></div>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </div>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar month={field.value} mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {changedFields.finalDeadlineTp1 && originalValues.finalDeadlineTp1 && <p className="text-xs text-yellow-600 mt-1">Changed from: {format(originalValues.finalDeadlineTp1, "PPP")}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <h4 className="">TP 2 Deadlines</h4>
                        <FormField
                            control={form.control}
                            name="internalModerationTp2"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Internal moderation deadline</FormLabel>
                                    <div className="relative">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", changedFields.internalModerationTp2 && "bg-yellow-50 border-yellow-300")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <div className="flex items-center justify-end ml-auto gap-x-2">
                                                            {changedFields.internalModerationTp2 && <div className=" h-2 w-2 rounded-full bg-yellow-400" title="This date has been changed"></div>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </div>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar month={field.value} mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {changedFields.internalModerationTp2 && originalValues.internalModerationTp2 && <p className="text-xs text-yellow-600 mt-1">Changed from: {format(originalValues.internalModerationTp2, "PPP")}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="externalModerationTp2"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>External moderation deadline</FormLabel>
                                    <div className="relative">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", changedFields.externalModerationTp2 && "bg-yellow-50 border-yellow-300")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <div className="flex items-center justify-end ml-auto gap-x-2">
                                                            {changedFields.externalModerationTp2 && <div className=" h-2 w-2 rounded-full bg-yellow-400" title="This date has been changed"></div>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </div>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar month={field.value} mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {changedFields.externalModerationTp2 && originalValues.externalModerationTp2 && <p className="text-xs text-yellow-600 mt-1">Changed from: {format(originalValues.externalModerationTp2, "PPP")}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="finalDeadlineTp2"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Final deadline</FormLabel>
                                    <div className="relative">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", changedFields.finalDeadlineTp2 && "bg-yellow-50 border-yellow-300")}>
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        <div className="flex items-center justify-end ml-auto gap-x-2">
                                                            {changedFields.finalDeadlineTp2 && <div className=" h-2 w-2 rounded-full bg-yellow-400" title="This date has been changed"></div>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </div>
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar month={field.value} mode="single" selected={field.value} onSelect={field.onChange} disabled={(date: Date) => date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    {changedFields.finalDeadlineTp2 && originalValues.finalDeadlineTp2 && <p className="text-xs text-yellow-600 mt-1">Changed from: {format(originalValues.finalDeadlineTp2, "PPP")}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="w-fit" disabled={isSaving}>
                                    {isSaving ? (
                                        <>
                                            <Loader className="mx-auto" variant="circular" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm deadlines changes</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {changedFields.internalModerationTp1 && (
                                            <div className="text-sm text-muted-foreground">
                                                <div>
                                                    <p className="font-bold text-slate-900">Internal Moderation TP1:</p>{" "}
                                                    <div className="flex items-center gap-1">
                                                        {format(originalValues.internalModerationTp1, "PPP")} <MoveRight /> {format(formValues.internalModerationTp1 as Date, "PPP")}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {changedFields.externalModerationTp1 && (
                                            <div className="text-sm text-muted-foreground">
                                                <div>
                                                    <p className="font-bold text-slate-900">External Moderation TP1:</p>{" "}
                                                    <div className="flex items-center gap-1">
                                                        {" "}
                                                        {format(originalValues.externalModerationTp1, "PPP")} <MoveRight /> {format(formValues.externalModerationTp1 as Date, "PPP")}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {changedFields.finalDeadlineTp1 && (
                                            <div className="text-sm text-muted-foreground">
                                                <div>
                                                    <p className="font-bold text-slate-900">Final Deadline TP1:</p>{" "}
                                                    <div className="flex items-center gap-1">
                                                        {" "}
                                                        {format(originalValues.finalDeadlineTp1, "PPP")} <MoveRight /> {format(formValues.finalDeadlineTp1 as Date, "PPP")}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {changedFields.internalModerationTp2 && (
                                            <div className="text-sm text-muted-foreground">
                                                <div>
                                                    <p className="font-bold text-slate-900">Internal Moderation TP2:</p>{" "}
                                                    <div className="flex items-center gap-1">
                                                        {" "}
                                                        {format(originalValues.internalModerationTp2, "PPP")} <MoveRight /> {format(formValues.internalModerationTp2 as Date, "PPP")}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {changedFields.externalModerationTp2 && (
                                            <div className="text-sm text-muted-foreground">
                                                <div>
                                                    <p className="font-bold text-slate-900">External Moderation TP2:</p>{" "}
                                                    <div className="flex items-center gap-1">
                                                        {" "}
                                                        {format(originalValues.externalModerationTp2, "PPP")} <MoveRight /> {format(formValues.externalModerationTp2 as Date, "PPP")}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {changedFields.finalDeadlineTp2 && (
                                            <div className="text-sm text-muted-foreground">
                                                <div>
                                                    <p className="font-bold text-slate-900">Final Deadline TP2:</p>{" "}
                                                    <div className="flex items-center gap-1">
                                                        {" "}
                                                        {format(originalValues.finalDeadlineTp2, "PPP")} <MoveRight /> {format(formValues.finalDeadlineTp2 as Date, "PPP")}{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button className="w-fit" type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <Loader className="mx-auto" variant="circular" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Submit"
                                            )}
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
