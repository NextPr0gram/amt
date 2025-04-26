"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { protectedFetch } from "@/utils/protected-fetch";
import { Separator } from "../ui/separator";
import { Loader } from "../ui/loader";
import Link from "next/link";
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

type AssessmentsCardProps = {
    className?: string;
};

const AssessmentsCard = ({ className }: AssessmentsCardProps) => {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { moderationStatus, fetchModerationStatus } = useModeration();

    useEffect(() => {
        const fetchAssessments = async () => {
            const fetchAssessmentByTP = async () => {
                if (moderationStatus?.moderationPhase?.id === 3 || moderationStatus?.moderationPhase?.id === 4) {
                    return await protectedFetch("/user/assessments-tp1", "GET");
                } else if (moderationStatus?.moderationPhase?.id === 7 || moderationStatus?.moderationPhase?.id === 8) {
                    return await protectedFetch("/user/assessments-tp2", "GET");
                }
            };
            const res = await fetchAssessmentByTP();
            (await res.status) === 200 && setAssessments(res.data);
        };
        fetchAssessments();
        setIsLoading(false);
    }, [moderationStatus]);

    if (isLoading) {
        return (
            <Card className="h-60 flex justify-center items-center">
                <Loader className="mx-auto" variant="circular" />
            </Card>
        );
    }
    return (
        <Card className={className}>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-lg w-fit">{moderationStatus?.moderationPhase?.id === 3 || moderationStatus?.moderationPhase?.id === 4 ? `Your assessments for TP 1` : moderationStatus?.moderationPhase?.id === 7 || moderationStatus?.moderationPhase?.id === 8 ? `Your assessments for TP 2` : "Your assessments"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
                {assessments?.length ? (
                    <div>
                        <Separator />
                        {assessments.map((assessment) => (
                            <div key={assessment.id}>
                                <div className="flex justify-between py-4 px-2">
                                    {assessment.name ? assessment.name : `${assessment.module.code} - ${assessment.assessmentCategory.name} ${assessment.assessmentType.name} weight: ${Math.round(assessment.weight * 100)}%`}
                                    <a className="text-blue-600 hover:underline" href={"https://app.box.com/folder/" + assessment.folderId} target="_blank" rel="noopener noreferrer">
                                        View folder
                                    </a>
                                </div>
                                <Separator />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You do not have any assessments</p>
                )}
            </CardContent>{" "}
        </Card>
    );
};

export default AssessmentsCard;
