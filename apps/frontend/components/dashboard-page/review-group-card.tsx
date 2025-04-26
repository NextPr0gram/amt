"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { protectedFetch } from "@/utils/protected-fetch";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import { Loader } from "../ui/loader";
import { useModeration } from "../contexts/moderation-context";

export type ReviewGroup = {
    id: number;
    group: string;
    year: {
        name: string;
    };
    convener: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    modules: {
        id: number;
        name: string;
        code: string;
        moduleLead: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
        };
        moduleTutors: {
            user: {
                id: number;
                firstName: string;
                lastName: string;
                email: string;
            };
        }[];
    }[];
};

const ReviewGroupCard = () => {
    const [reviewGroups, setReviewGroups] = useState<ReviewGroup[] | null>(null); // Changed state name and type
    const [isLoading, setIsLoading] = useState(true);
    const { moderationStatus } = useModeration();

    useEffect(() => {
        const fetchReviewGroups = async () => {
            setIsLoading(true);
            try {
                const res = await protectedFetch("/user/review-group", "GET");
                if (res.status === 200) {
                    setReviewGroups(res.data);
                } else {
                    setReviewGroups([]);
                }
            } catch (error) {
                console.error("Failed to fetch review groups:", error);
                setReviewGroups([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviewGroups();
    }, [moderationStatus]);

    if (isLoading) {
        return (
            <Card className="h-60 flex justify-center items-center">
                <Loader className="mx-auto" variant="circular" />
            </Card>
        );
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Your review groups</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
                {" "}
                {reviewGroups && reviewGroups.length > 0 ? (
                    reviewGroups.map((reviewGroup) => (
                        <Card key={reviewGroup.id} className="p-4">
                            {" "}
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-base font-semibold">
                                    {reviewGroup.year.name}, Group {reviewGroup.group}
                                </h3>
                                <Badge variant="outline" className="text-sm">
                                    Convener: {reviewGroup.convener.firstName} {reviewGroup.convener.lastName}
                                </Badge>
                            </div>
                            <Separator className="mb-4" />
                            {reviewGroup.modules.map((module) => (
                                <div key={module.id}>
                                    <div className="flex gap-2 items-center">
                                        {" "}
                                        <p className="text-base font-medium">{module.name}</p>
                                        <Badge variant="outline">{module.code}</Badge>
                                    </div>
                                    <div className="mt-2 p-0 pb-4 text-sm text-muted-foreground">
                                        {" "}
                                        Module Lead: {module.moduleLead.firstName} {module.moduleLead.lastName}
                                        <div>
                                            {module.moduleTutors.length > 0 && (
                                                <div>
                                                    Module Tutors:{" "}
                                                    {module.moduleTutors.map((tutor, index) => {
                                                        const tutorName = `${tutor.user.firstName} ${tutor.user.lastName}`;

                                                        return index < module.moduleTutors.length - 1 ? tutorName + ", " : tutorName;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card>
                    ))
                ) : (
                    <p>You are not assigned to any review group for the current phase.</p>
                )}
            </CardContent>
        </Card>
    );
};

export default ReviewGroupCard;
