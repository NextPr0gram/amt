"use client"

import { protectedFetch } from "@/utils/protected-fetch";
import { Button } from "../ui/button";
import { useReviewGroups } from "./review-groups-context";
import { useEffect } from "react";


export const FinalizeReviewGroups = () => {
    const { finalizeReviewGroups, fetchFinalizeReviewGroups, reviewGroups } = useReviewGroups();

    useEffect(() => {
        fetchFinalizeReviewGroups()
    }, [])

    const onSubmit = async () => {
        await protectedFetch("/review-groups/finalize", "POST")
        fetchFinalizeReviewGroups()
    }

    if (finalizeReviewGroups) return null;

    return (

        reviewGroups.length > 0 ? (
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center justify-between space-x-6 lg:space-x-8 w-full">
                    <div className="flex justify-end w-full"><Button size="sm" onClick={onSubmit}>Finalize review groups</Button></div>
                </div>
            </div>
        ) : ""
    );
}
