import { AppSidebar } from "@/components/app-sidebar";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { ERFoldersProvider } from "../../components/external-reviewers-folders-page/er-folders-context";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { DateStage } from "@/components/date-stage";
import { DeadlinesForm } from "@/components/deadlines-page/deadlines-form";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DemoDateProvider } from "@/components/contexts/demo-date-context";
import { DraggableDemoControl } from "@/components/draggable-demo-control";

export default function Page() {
    return (
        <SidebarProvider>
            <DemoDateProvider>
                <AppSidebar />
                <SidebarInset>
                    <WebsocketProvider>
                        <ERFoldersProvider>
                            <ModerationProvider>
                                <DateStage />
                                <header className="flex h-16 shrink-0 items-center gap-2">
                                    <div className="flex items-center gap-2 px-4">
                                        <h1 className="text-2xl font-bold tracking-tight">Deadlines</h1>
                                    </div>
                                </header>
                                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                    <div>
                                        <DeadlinesForm />
                                    </div>
                                </div>
                                <DraggableDemoControl />
                            </ModerationProvider>
                        </ERFoldersProvider>
                    </WebsocketProvider>
                </SidebarInset>
            </DemoDateProvider>
        </SidebarProvider>
    );
}
