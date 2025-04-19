"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { DialogTitle } from "../ui/dialog";
import { protectedFetch } from "@/utils/protected-fetch";
import { notify } from "../contexts/websocket-context";
import { Loader } from "../ui/loader";
import { useState, useEffect } from "react";
import { useERFolders } from "../external-reviewers-folders-page/er-folders-context";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "../ui/table";
import SendFoldersToErDialog from "@/components/dashboard-page/send-folders-to-er-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

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
    numberOfFiles: z.number(),
    sendToEr: z.boolean().default(false),
    erFolderEmail: z.string().optional(), // Optional email if sendToEr is true
    message: z.string().optional(), // Optional message if sendToEr is false
});

// Define the main form schema containing an array of assessment items
const formSchema = z.object({
    assessments: z.array(assessmentItemSchema),
});

const SendFoldersToErCard = () => {
    const { fetchERFolders, erFolders } = useERFolders();
    const [loading, setLoading] = useState(false);

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

    // Fetch ER Folders when the component mounts
    useEffect(() => {
        setLoading(true);
        fetchERFolders();
        const fetchExamOnlyAssessments = async () => {
            const res = await protectedFetch("/academic-year-assessments/current-ac-year-exams", "GET");
            form.reset({
                assessments: res.data.map((assessment) => ({
                    assessmentId: assessment.id,
                    folderId: assessment.folderId,
                    assessmentName: assessment.name,
                    sendToEr: false,
                    erFolderEmail: "",
                    message: "",
                })),
            });
            setLoading(false);
        };
        fetchExamOnlyAssessments();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        console.log("Form Values:", values); // Log form values for debugging

        const assessmentsToSendToEr = values.assessments.filter((a) => a.sendToEr && a.erFolderEmail).map((a) => ({ id: a.assessmentId, erFolderEmail: a.erFolderEmail as string }));

        const assessmentsToNotify = values.assessments.filter((a) => !a.sendToEr && a.message).map((a) => ({ id: a.assessmentId, message: a.message as string }));

        console.log("To Send ER:", assessmentsToSendToEr);
        console.log("To Notify:", assessmentsToNotify);

        try {
            const requests: Promise<any>[] = [];

            if (assessmentsToSendToEr.length > 0) {
                requests.push(protectedFetch("/er/send-to-er", "POST", assessmentsToSendToEr));
            }

            if (assessmentsToNotify.length > 0) {
                requests.push(protectedFetch("/users/notify", "POST", assessmentsToNotify));
            }

            if (requests.length > 0) {
                await Promise.all(requests);
                notify("success", "Actions submitted successfully");
                fetchERFolders(); // Refresh ER folders list if needed
                // Optionally close the modal here
            } else {
                notify("info", "No actions to submit");
            }
        } catch (error: string) {
            console.error("Submission error:", error);
            notify("error", "Error submitting actions", error.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="h-60 flex justify-center items-center">
                <Loader className="mx-auto" variant="circular" />
            </Card>
        );
    }
    return (
        <Card className="border-none">
            <CardHeader className="flex flex-row justify-between p-0">
                <CardTitle className="text-lg w-fit">Send Folders to ER / Notify</CardTitle>
            </CardHeader>
            <ScrollArea className="h-full w-full">
                <CardContent className="text-sm p-0 ">
                    {/* <DialogTitle>Send Folders to ER / Notify</DialogTitle> */}
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
                                                        {/* Placeholder for folder link - adjust as needed */}
                                                        <a href={`https://app.box.com/folder/${field.folderId}`} target="_blank" rel="noopener noreferrer" className=" hover:underline">
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
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                                                name={`assessments.${index}.erFolderEmail`}
                                                render={({ field: selectField }) => (
                                                    <FormItem>
                                                        <FormLabel>Select ER Folder</FormLabel>
                                                        <Select onValueChange={selectField.onChange} defaultValue={selectField.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select an ER folder..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {erFolders && erFolders.length > 0 ? (
                                                                    erFolders.map((folder) => (
                                                                        // Assuming erFolder has 'email' and a unique 'id' or 'name'
                                                                        <SelectItem key={folder.email} value={folder.email}>
                                                                            {folder.email}
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
                                                            <Textarea placeholder="Enter a message..." {...textAreaField} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                            <Button size="sm" type="submit" disabled={loading}>
                                {loading ? "Processing..." : "Submit Actions"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </ScrollArea>
        </Card>
    );
};

export default SendFoldersToErCard;
