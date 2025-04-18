"use client"
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import ReviewGroupsModal from "./review-groups-modal";
import { useReviewGroups } from "./review-groups-context";

const CreateReviewGroupDialog = () => {
    const { fetchFinalizeReviewGroups, finalizeReviewGroups, reviewGroups } = useReviewGroups();

    useEffect(() => {
        fetchFinalizeReviewGroups()
    }, [])

    if (finalizeReviewGroups) return null;


    return (
        reviewGroups.length > 0 ? (
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm" className="ml-auto">
                        Create review group
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <ReviewGroupsModal type="add" />
                </DialogContent>
            </Dialog>
        ) : ""
    );
};

export default CreateReviewGroupDialog;
