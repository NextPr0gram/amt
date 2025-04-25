"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { protectedFetch } from "@/utils/protected-fetch";
import { Button } from "../ui/button";
import { useReviewGroups } from "./review-groups-context";
import { useEffect } from "react";

export const FinalizeReviewGroups = () => {
    const { finalizeReviewGroups, fetchFinalizeReviewGroups, reviewGroups } = useReviewGroups();

    useEffect(() => {
        fetchFinalizeReviewGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async () => {
        await protectedFetch("/review-groups/finalize", "POST");
        fetchFinalizeReviewGroups();
    };

    if (finalizeReviewGroups) return null;

    return reviewGroups.length > 0 ? (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center justify-between space-x-6 lg:space-x-8 w-full">
                <div className="flex justify-end w-full">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm">Finalize review groups</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. After finalizing review groups, they cannot be edited or deleted, the BOX folders will be created and the moderation status will proceed to the next phase.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onSubmit}>Finalize review groups</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div>
    ) : (
        ""
    );
};
