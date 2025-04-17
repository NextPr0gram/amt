import { AppSidebar } from "@/components/app-sidebar";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { DateStage } from "@/components/date-stage";
import { DataTable } from "@/components/external-reviewers-folders-page/data-table";
import { ERFoldersProvider } from "@/components/external-reviewers-folders-page/er-folders-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <WebsocketProvider>
                    <ModerationProvider>
                        <DateStage />
                        <header className="flex h-16 shrink-0 items-center gap-2">
                            <div className="flex items-center gap-2 px-4">
                                <h1 className="text-2xl font-bold tracking-tight">External Reviewers Folders</h1>
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            <ERFoldersProvider>
                                <DataTable />
                            </ERFoldersProvider>
                        </div>
                    </ModerationProvider>
                </WebsocketProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
