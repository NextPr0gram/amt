"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AssessmentsCard from "./assessments-card";
import AssessmentsToModerateCard from "./assessments-to-moderate-card";
import ReviewGroupCard from "./review-group-card";
import SendFoldersToErCard from "./send-folders-to-er-card";
import { protectedFetch } from "@/utils/protected-fetch";
import { Loader } from "../ui/loader";
import ProceesToNextPhaseCard from "./proceed-to-next-phase";
import { useModeration } from "../contexts/moderation-context";

const DashboardTabs = () => {
    const [isAssessmentLead, setIsAssessmentLead] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const { moderationStatus, fetchModerationStatus } = useModeration();

    useEffect(() => {
        setIsMounted(true);
        const fetchUserRole = async () => {
            setIsLoadingRole(true);
            try {
                const res = await protectedFetch("/user/user-roles", "GET");
                if (res.data && Array.isArray(res.data)) {
                    const hasAssessmentLeadRole = res.data.some((role: { role: { id: number; name: string } }) => role.role.id === 1);

                    setIsAssessmentLead(hasAssessmentLeadRole);
                } else {
                    console.error("Invalid user roles data:", res.data);
                    setIsAssessmentLead(false);
                }
            } catch (error) {
                console.error("Failed to fetch user roles:", error);
                setIsAssessmentLead(false);
            } finally {
                setIsLoadingRole(false);
            }
        };
        fetchUserRole();
    }, []);

    if (!isMounted || isLoadingRole) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader variant="circular" />
            </div>
        );
    }

    return (
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                {isAssessmentLead && <TabsTrigger value="er">ER Folders</TabsTrigger>}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
                <div className="flex flex-col gap-4">
                    {(moderationStatus?.moderationPhase?.id === 2 || moderationStatus?.moderationPhase?.id === 6) && <ProceesToNextPhaseCard cname="" />}
                    <div className="grid lg:grid-cols-2 gap-4">
                        <AssessmentsCard className="" />
                        <AssessmentsToModerateCard className="" />
                    </div>
                    <ReviewGroupCard />
                </div>
            </TabsContent>
            {isAssessmentLead && (
                <TabsContent value="er" className="space-y-4">
                    <div className="grid  gap-4">
                        <SendFoldersToErCard />
                    </div>
                </TabsContent>
            )}
        </Tabs>
    );
};

export default DashboardTabs;
