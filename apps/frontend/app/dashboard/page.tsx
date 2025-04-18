import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewGroupCard from "@/components/dashboard-page/review-group-card";
import AssessmentsCard from "@/components/dashboard-page/assessments-card";
import AssessmentsToModerateCard from "@/components/dashboard-page/assessments-to-moderate-card";
import SendFoldersToErDialog from "@/components/dashboard-page/send-folders-to-er-dialog";
import { ERFoldersProvider } from "../../components/external-reviewers-folders-page/er-folders-context";
import SendFoldersToErCard from "@/components/dashboard-page/send-folders-to-er-card";

export default function Page() {
    return (
        <SidebarProvider>
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
                                <Tabs defaultValue="overview" className="space-y-4">
                                    <TabsList>
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="er">External Review</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="overview" className="space-y-4">
                                        <div className="flex flex-col gap-4">
                                            <div className="grid lg:grid-cols-2 gap-4">
                                                <AssessmentsCard className="" />
                                                <AssessmentsToModerateCard className="" />
                                            </div>
                                            <ReviewGroupCard />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="er" className="space-y-4">
                                        <div className="">
                                            <SendFoldersToErCard />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </ERFoldersProvider>
                    </ModerationProvider>
                </WebsocketProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
