import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { protectedFetch } from "@/utils/protected-fetch";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDemoDate } from "./contexts/demo-date-context";
import { useModeration } from "./contexts/moderation-context";

const DemoControl = () => {
    const { fetchDate } = useDemoDate();
    const { moderationStatus, fetchModerationStatus } = useModeration();
    return (
        <Card className="p-4">
            <div className="space-y-2 ">
                <div className="flex space-x-2">
                    <Button
                        onClick={async () => {
                            await protectedFetch("/demo/add-1-day", "POST");
                            fetchDate();
                            fetchModerationStatus();
                        }}
                        className="text-xs p-0 h-6 flex-1"
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
                        className="text-xs p-0 h-6 flex-1"
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
                        className="text-xs p-0 h-6 flex-1"
                        variant="outline"
                    >
                        +10
                    </Button>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={async () => {
                            await protectedFetch("/demo/subtract-1-day", "POST");
                            fetchDate();
                            fetchModerationStatus();
                        }}
                        className="text-xs p-0 h-6 flex-1"
                        variant="outline"
                    >
                        -1
                    </Button>
                    <Button
                        onClick={async () => {
                            await protectedFetch("/demo/subtract-5-days", "POST");
                            fetchDate();
                            fetchModerationStatus();
                        }}
                        className="text-xs p-0 h-6 flex-1"
                        variant="outline"
                    >
                        -5
                    </Button>
                    <Button
                        onClick={async () => {
                            await protectedFetch("/demo/subtract-10-days", "POST");
                            fetchDate();
                            fetchModerationStatus();
                        }}
                        className="text-xs p-0 h-6 flex-1"
                        variant="outline"
                    >
                        -10
                    </Button>
                </div>
                <Button className="text-xs p-0 h-6 w-full" variant="outline" onClick={() => protectedFetch("/demo/unfinalize-review-groups", "POST")}>
                    Unfinalize RGs
                </Button>
                <Button className="text-xs p-0 h-6 w-full" variant="outline" onClick={() => toast.error("Toast title", { icon: <Bell className="size-5 mx-2" />, description: "toast description", descriptionClassName: cn("text-red-500") })}>
                    Toast
                </Button>
                <div className="flex space-x-2">
                    <Button onClick={() => protectedFetch("/demo/prev-phase", "POST")} className="text-xs p-0 h-6 flex-1" variant="outline">
                        P Phase
                    </Button>
                    <Button onClick={() => protectedFetch("/demo/next-phase", "POST")} className="text-xs p-0 h-6 flex-1" variant="outline">
                        N Phase
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default DemoControl;
