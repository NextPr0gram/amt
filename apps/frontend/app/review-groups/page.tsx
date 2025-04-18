import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/review-groups-page/data-table";
import { ReviewGroupsProvider } from "@/components/review-groups-page/review-groups-context";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import CreateReviewGroupDialog from "@/components/review-groups-page/create-review-groups-dialog";

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <WebsocketProvider>
                    <ModerationProvider>
                        <DateStage />
                        <ReviewGroupsProvider>
                            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-bold tracking-tight">Review Groups</h1>
                                </div>
                                <CreateReviewGroupDialog />
                            </header>
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                <DataTable />
                            </div>
                        </ReviewGroupsProvider>
                    </ModerationProvider>
                </WebsocketProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
