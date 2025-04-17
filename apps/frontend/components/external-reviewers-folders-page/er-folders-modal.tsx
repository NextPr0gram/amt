"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useERFolders } from "./er-folders-context";
import { DialogTitle } from "../ui/dialog";
import { protectedFetch } from "@/utils/protected-fetch";
import { notify } from "../contexts/websocket-context";
import { Input } from "../ui/input";
import { Loader } from "../ui/loader";
import { useState } from "react";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
});

const ERFolderModal = () => {
    const { fetchERFolders } = useERFolders();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        const res = await protectedFetch("/er/folders", "POST", {
            email: values.email,
        });
        setLoading(false);
        if (res.status === 200 || res.status === 201) {
            fetchERFolders();
            form.reset();
        } else {
            if (res.data.errorCode === "ResourceAlreadyExists") {
                form.setError("email", { message: res.data.message });
            } else {
                notify("error", "Something went wrong while adding the folder", res.data.message);
            }
        }
    };

    return (
        <>
            {loading ? (
                <div className="p-8 flex justify-center items-center">
                    <div className="text-sm pr-1">Adding ER folder... </div> <Loader />
                </div>
            ) : (
                <>
                    <DialogTitle>Add ER folder</DialogTitle>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <Button size="sm" type="submit">
                                Add
                            </Button>
                        </form>
                    </Form>
                </>
            )}
        </>
    );
};

export default ERFolderModal;
