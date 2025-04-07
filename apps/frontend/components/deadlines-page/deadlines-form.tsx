// File: /home/nextprogram/Repositories/amt/apps/frontend/components/deadlines-page/deadlines-form.tsx

"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

const formSchema = z.object({
    internalModeration: z.date({
        required_error: "A date is required.",
    }),
    externalModeration: z.date({
        required_error: "A date is required.",
    }),
    finalDeadline: z.date({
        required_error: "A date is required.",
    }),
})

export const DeadlinesForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notFound, setNotFound] = useState(false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const fetchDeadlines = async () => {
        setIsLoading(true);
        try {
            const res = await protectedFetch("/moderation/status", "GET");

            if (res.status === 200 && res.data) {
                // Parse dates safely
                const internalDate = res.data.internalModerationDeadline
                console.log(res.data.internalModerationDeadline)


                const externalDate = res.data.externalModerationDeadline

                const finalDate = res.data.finalDeadline


                form.reset({
                    internalModeration: new Date(internalDate),
                    externalModeration: new Date(externalDate),
                    finalDeadline: new Date(finalDate),
                });
            } else {
                setNotFound(true)
                toast.error("Failed to load deadlines");
            }
        } catch (error) {
            setNotFound(true)
            // Set default dates on error
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
            const internalResponse = await protectedFetch(
                "/moderation/deadlines/internal",
                "PATCH",
                { deadlineDate: data.internalModeration.toISOString() }
            );

            const externalResponse = await protectedFetch(
                "/moderation/deadlines/external",
                "PATCH",
                { deadlineDate: data.externalModeration.toISOString() }
            );

            const finalResponse = await protectedFetch(
                "/moderation/deadlines/final",
                "PATCH",
                { deadlineDate: data.finalDeadline.toISOString() }
            );

            if (
                internalResponse.status === 200 &&
                externalResponse.status === 200 &&
                finalResponse.status === 200
            ) {
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
        return (
            <div className="flex items-center justify-center p-6">
                Could not fetch data
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid w-full max-w-sm gap-6"
            >
                <FormField
                    control={form.control}
                    name="internalModeration"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Internal moderation deadline</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date: Date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="externalModeration"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>External moderation deadline</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date: Date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="finalDeadline"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Final deadline</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date: Date) =>
                                            date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                The final deadline where exam papers go to the office for printing
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="w-fit"
                    type="submit"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Submit"
                    )}
                </Button>
            </form>
        </Form>
    )
}
