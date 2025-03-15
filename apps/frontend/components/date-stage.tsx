"use client";
import { useModeration } from "./contexts/moderation-context";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export function DateStage() {
    const date = new Date().toDateString();
    const { moderationStatus } = useModeration();
    return (
        <>
            <div className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-6" />
                    <h3>{date + " | " + (moderationStatus ? moderationStatus.tP.name + " | " + moderationStatus.stage.name + (moderationStatus.reviewType.id === 3 ? "" : " | " + moderationStatus.reviewType.name) : "")}</h3>
                </div>
            </div>
            <div className="px-4">
                <Separator />
            </div>
        </>
    );
}
