"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { DialogTitle } from "../ui/dialog"; // Assuming this is correct path
import { protectedFetch } from "@/utils/protected-fetch";
import { notify } from "../contexts/websocket-context"; // Assuming this is correct path
import { Loader } from "../ui/loader"; // Assuming this is correct path
import { useState, useEffect } from "react";
import { useERFolders, ERFolder } from "../external-reviewers-folders-page/er-folders-context"; // Assuming this is correct path and ERFolder type is exported
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "../ui/table";
// Removed unused SendFoldersToErDialog import
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { useModeration } from "../contexts/moderation-context";

// Assuming AssessmentFolder structure based on previous context
interface AssessmentFolder {
    assessmentId: number;
    assessmentName: string;
    folderId: string;
}

// Define the schema for a single assessment item within the form
const assessmentItemSchema = z.object({
    assessmentId: z.number(),
    folderId: z.string(),
    assessmentName: z.string(),
    sendToEr: z.boolean().default(false),
    // Changed from erFolderEmail to erFolderId, now expects a number ID
    erFolderId: z.number().int().positive().optional(),
    message: z.string().optional(), // Optional message if sendToEr is false
});

// Define the main form schema containing an array of assessment items
const formSchema = z.object({
    assessments: z.array(assessmentItemSchema),
});

const SendFoldersToErCard = () => {
    // Ensure ERFolder type includes 'id' and 'email'
    const { fetchERFolders, erFolders } = useERFolders();
    const [loading, setLoading] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [message, setMessage] = useState("");
    const [isAssessmentsFetched, setIsAssessmentsFetched] = useState(false);
    const { moderationStatus, fetchModerationStatus } = useModeration();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            assessments: [], // Start with an empty array
        },
    });

    // Use useFieldArray to manage the dynamic list of assessments in the form
    const { fields } = useFieldArray({
        control: form.control,
        name: "assessments",
    });

    const fetchExamOnlyAssessments = async () => {
        try {
            const fetchAcademicYearAssessmentByTP = async () => {
                if (moderationStatus?.moderationPhase?.id === 3 || moderationStatus?.moderationPhase?.id === 4) {
                    return await protectedFetch("/academic-year-assessments/current-ac-year-exams-tp1", "GET");
                } else if (moderationStatus?.moderationPhase?.id === 7 || moderationStatus?.moderationPhase?.id === 8) {
                    return await protectedFetch("/academic-year-assessments/current-ac-year-exams-tp2", "GET");
                } else {
                    return { data: { code: "NotExternalReview" } };
                }
            };
            const res = await fetchAcademicYearAssessmentByTP();
            if (res.data && Array.isArray(res.data) && res.status === 200) {
                setIsAssessmentsFetched(true);
                form.reset({
                    assessments: res.data.map((assessment) => ({
                        assessmentId: assessment.id,
                        folderId: assessment.folderId,
                        assessmentName: assessment.name,
                        sendToEr: false,
                        erFolderId: undefined,
                        message: "",
                    })),
                });
            } else {
                setIsAssessmentsFetched(false);
                if (res.data.code === "NotExternalReview") {
                    setMessage("Cannot retrieve assessments because it is not external review phase yet");
                } else {
                    setMessage("No exam assessments found for the current academic year.");
                }
                console.error("Unexpected data format for assessments:", res.data);
                form.reset({ assessments: [] });
            }
        } catch (error) {
            form.reset({ assessments: [] });
            console.error("Error fetching assessments:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch ER Folders and assessments when the component mounts
    useEffect(() => {
        setLoading(true);
        fetchERFolders(); // Fetch ER Folders first
        fetchExamOnlyAssessments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setSendingForm(true);
        console.log("Form Values:", values); // Log form values for debugging

        // Filter assessments to send to ER, ensuring erFolderId is present
        const assessmentsToSendToEr = values.assessments
            .filter((a) => a.sendToEr && a.erFolderId)
            .map((a) => ({
                id: a.assessmentId,
                // Send the erFolderId
                erFolderId: a.erFolderId as number,
            }));

        const assessmentsToNotify = values.assessments
            .filter((a) => !a.sendToEr && a.message)
            .map((a) => ({
                id: a.assessmentId,
                message: a.message as string,
            }));

        console.log("To Send ER (Payload):", assessmentsToSendToEr);
        console.log("To Notify (Payload):", assessmentsToNotify);

        try {
            const requests: Promise<any>[] = [];

            if (assessmentsToSendToEr.length > 0) {
                // Ensure the backend endpoint /er/send-to-er expects 'erFolderId'
                requests.push(protectedFetch("/er/send-to-er", "POST", assessmentsToSendToEr));
            }

            if (assessmentsToNotify.length > 0) {
                requests.push(protectedFetch("/users/notify", "POST", assessmentsToNotify));
            }

            if (requests.length > 0) {
                await Promise.all(requests);
                notify("success", "Actions submitted successfully");
                fetchERFolders(); // Refresh ER folders list if needed

                // Optionally reset form or close modal here
            } else {
                notify("info", "No actions to submit");
            }
        } catch (error: any) {
            // Catch specific error type if possible
            console.error("Submission error:", error);
            notify("error", "Error submitting actions", error?.message || "An unknown error occurred");
        } finally {
            fetchExamOnlyAssessments();
            setSendingForm(false);
        }
    };

    if (loading && fields.length === 0) {
        return (
            <Card className="h-60 flex justify-center items-center">
                <Loader className="mx-auto" variant="circular" />
            </Card>
        );
    }

    if (!isAssessmentsFetched) {
        return (
            <Card className=" flex justify-center items-center">
                <p className="text-sm text-muted-foreground text-center py-4">{message}</p>
            </Card>
        );
    }

    return (
        <Card className="border-none">
            <CardHeader className="flex flex-row justify-between p-0">
                <CardTitle className="text-lg w-fit">Send Folders to ER / Notify Tutors</CardTitle>
            </CardHeader>
            <ScrollArea className="h-full w-full">
                <CardContent className="text-sm p-0 ">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                            {fields.map((field, index) => {
                                const watchSendToEr = form.watch(`assessments.${index}.sendToEr`);
                                return (
                                    <div key={field.id} className="p-4 border rounded-md space-y-3">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Assessment Name</TableHead>
                                                    <TableHead>Folder Link</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="font-medium">{field.assessmentName}</TableCell>
                                                    <TableCell>
                                                        <a
                                                            href={`https://app.box.com/folder/${field.folderId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline" // Added basic styling
                                                        >
                                                            View Folder
                                                        </a>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <FormField
                                            control={form.control}
                                            name={`assessments.${index}.sendToEr`}
                                            render={({ field: checkboxField }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                                                    <FormControl>
                                                        <Checkbox checked={checkboxField.value} onCheckedChange={checkboxField.onChange} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Send to External Reviewer?</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        {watchSendToEr ? (
                                            <FormField
                                                control={form.control}
                                                // Use the renamed field: erFolderId
                                                name={`assessments.${index}.erFolderId`}
                                                render={({ field: selectField }) => (
                                                    <FormItem>
                                                        <FormLabel>Select ER Folder (by Email)</FormLabel>
                                                        <Select
                                                            // Convert number ID to string for Select value
                                                            onValueChange={(value) => selectField.onChange(parseInt(value, 10))} // Parse back to number on change
                                                            // Convert number ID to string for Select defaultValue
                                                            defaultValue={selectField.value ? selectField.value.toString() : undefined}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select an ER folder..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {erFolders && erFolders.length > 0 ? (
                                                                    erFolders.map((folder: ERFolder) => (
                                                                        // Use folder.id as the key and value
                                                                        // Display folder.email to the user
                                                                        <SelectItem
                                                                            key={folder.id}
                                                                            value={folder.id.toString()} // Value must be a string
                                                                        >
                                                                            {folder.email} {/* Display email */}
                                                                        </SelectItem>
                                                                    ))
                                                                ) : (
                                                                    <SelectItem value="-" disabled>
                                                                        No ER folders available
                                                                    </SelectItem>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        ) : (
                                            <FormField
                                                control={form.control}
                                                name={`assessments.${index}.message`}
                                                render={({ field: textAreaField }) => (
                                                    <FormItem>
                                                        <FormLabel>Send message to module tutors</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Enter a message (e.g., 'Need to make some changes')..." {...textAreaField} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            <Button size="sm" type="submit" disabled={sendingForm}>
                                {sendingForm ? "Submitting..." : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </ScrollArea>
        </Card>
    );
};

export default SendFoldersToErCard;
