import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { ERFoldersProvider } from "../../components/external-reviewers-folders-page/er-folders-context";
import DashboardTabs from "@/components/dashboard-page/dashboard-tabs";
import { DemoDateProvider } from "@/components/contexts/demo-date-context";
import { DraggableDemoControl } from "@/components/draggable-demo-control";
import DemoControlBar from "@/components/demo-control-bar";

export default function Page() {
    return (
        <SidebarProvider>
            <DemoDateProvider>
                <AppSidebar />
                <SidebarInset>
                    <WebsocketProvider>
                        <ModerationProvider>
                            <ERFoldersProvider>
                                <DateStage />
                                <div className="px-4"></div>
                                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                                    </div>
                                </header>
                                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                    <DashboardTabs />
                                </div>
                                <DemoControlBar />
                            </ERFoldersProvider>
                        </ModerationProvider>
                    </WebsocketProvider>
                </SidebarInset>
            </DemoDateProvider>
        </SidebarProvider>
    );
}
