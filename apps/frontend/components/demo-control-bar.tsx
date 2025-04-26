"use client";
import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { protectedFetch } from "@/utils/protected-fetch";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDemoDate } from "./contexts/demo-date-context";
import { useModeration } from "./contexts/moderation-context";

const DemoControlBar = () => {
    const { fetchDate } = useDemoDate();
    const { moderationStatus, fetchModerationStatus } = useModeration();
    return (
        <Card className="p-1 px-2 flex justify-center items-center m-1 gap-x-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 ">
            <p className="text-xs">Demo Controls</p>
            <div className="flex justify-center items-center gap-x-1">
                <Button
                    onClick={async () => {
                        await protectedFetch("/demo/subtract-10-days", "POST");
                        fetchDate();
                        fetchModerationStatus();
                    }}
                    className="text-xs px-2 h-6 flex-1"
                    variant="outline"
                >
                    -10
                </Button>
                <Button
                    onClick={async () => {
                        await protectedFetch("/demo/subtract-5-days", "POST");
                        fetchDate();
                        fetchModerationStatus();
                    }}
                    className="text-xs px-2 h-6 flex-1"
                    variant="outline"
                >
                    -5
                </Button>

                <Button
                    onClick={async () => {
                        await protectedFetch("/demo/subtract-1-day", "POST");
                        fetchDate();
                        fetchModerationStatus();
                    }}
                    className="text-xs px-2 h-6 flex-1"
                    variant="outline"
                >
                    -1
                </Button>
                <Button
                    onClick={async () => {
                        await protectedFetch("/demo/add-1-day", "POST");
                        fetchDate();
                        fetchModerationStatus();
                    }}
                    className="text-xs px-2 h-6 flex-1"
                    variant="outline"
                >
                    +1
                </Button>
                <Button
                    onClick={async () => {
                        await protectedFetch("/demo/add-5-days", "POST");
                        fetchDate();
                        fetchModerationStatus();
                    }}
                    className="text-xs px-2 h-6 flex-1"
                    variant="outline"
                >
                    +5
                </Button>
                <Button
                    onClick={async () => {
                        await protectedFetch("/demo/add-10-days", "POST");
                        fetchDate();
                        fetchModerationStatus();
                    }}
                    className="text-xs px-2 h-6 flex-1"
                    variant="outline"
                >
                    +10
                </Button>

                <Button className="text-xs px-2 h-6 flex-1" variant="outline" onClick={() => protectedFetch("/demo/unfinalize-review-groups", "POST")}>
                    Unfinalize RGs
                </Button>
                <Button className="text-xs px-2 h-6 flex-1" variant="outline" onClick={() => toast.error("Toast title", { icon: <Bell className="size-5 mx-2" />, description: "toast description", descriptionClassName: cn("text-red-500") })}>
                    Toast
                </Button>
                <Button onClick={() => protectedFetch("/demo/prev-phase", "POST")} className="text-xs px-2 h-6 flex-1" variant="outline">
                    P Phase
                </Button>
                <Button onClick={() => protectedFetch("/demo/next-phase", "POST")} className="text-xs px-2 h-6 flex-1" variant="outline">
                    N Phase
                </Button>
            </div>
        </Card>
    );
};

export default DemoControlBar;
