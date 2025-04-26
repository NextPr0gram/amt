"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { protectedFetch } from "@/utils/protected-fetch";
import { Separator } from "../ui/separator";
import { Loader } from "../ui/loader";
import { cn } from "@/lib/utils";
import { useModeration } from "../contexts/moderation-context";

export type Assessment = {
    id: number;
    name?: string;
    module: {
        code: string;
    };
    assessmentType: {
        id: number;
        name: string;
    };
    assessmentCategory: {
        id: number;
        name: string;
    };
    weight: number;
    folderId: string;
};

type AssessmentsToModerateCardProps = {
    className?: string;
};

const AssessmentsToModerateCard = ({ className }: AssessmentsToModerateCardProps) => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { moderationStatus, fetchModerationStatus } = useModeration();

    useEffect(() => {
        const fetchAssessments = async () => {
            const fetchAssessmensToModerateByTP = async () => {
                if (moderationStatus?.moderationPhase?.id === 3 || moderationStatus?.moderationPhase?.id === 4) {
                    const res = await protectedFetch("/user/assessments-to-moderate-tp1", "GET");
                    return res;
                } else if (moderationStatus?.moderationPhase?.id === 7 || moderationStatus?.moderationPhase?.id === 8) {
                    const res = await protectedFetch("/user/assessments-to-moderate-tp2", "GET");
                    return res;
                }
            };

            const res = await fetchAssessmensToModerateByTP();

            res.status === 200 && setAssessments(res.data);
        };
        fetchAssessments();
        setIsLoading(false);
    }, [moderationStatus]);

    if (isLoading) {
        return (
            <Card className={cn("h-60 flex justify-center items-center", className)}>
                <Loader className="mx-auto" variant="circular" />
            </Card>
        );
    }
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-lg w-fit">{moderationStatus?.moderationPhase?.id === 3 || moderationStatus?.moderationPhase?.id === 4 ? `Assessments to moderate for TP 1` : moderationStatus?.moderationPhase?.id === 7 || moderationStatus?.moderationPhase?.id === 8 ? `Assessments to moderate for TP 2` : "Assessments to moderate"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                {assessments?.length ? (
                    <div>
                        <Separator />
                        {assessments.map((assessment) => (
                            <div key={assessment.id}>
                                <div className="flex justify-between py-4 px-2">
                                    {assessment.name ? assessment.name : `${assessment.module.code} - ${assessment.assessmentCategory.name} ${assessment.assessmentType.name} weight: ${Math.round(assessment.weight * 100)}%`}
                                    <a className="hover:underline" href={"https://app.box.com/folder/" + assessment.folderId} target="_blank" rel="noopener noreferrer">
                                        View folder
                                    </a>
                                </div>
                                <Separator />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You do not have any assessments to moderate</p>
                )}
            </CardContent>{" "}
        </Card>
    );
};

export default AssessmentsToModerateCard;
