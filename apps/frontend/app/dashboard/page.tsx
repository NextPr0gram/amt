import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewGroupCard from "@/components/dashboard-page/review-group-card";

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <WebsocketProvider>
                    <ModerationProvider>
                        <DateStage />
                        <div className="px-4"></div>
                        <header className="flex h-16 shrink-0 items-center gap-2">
                            <div className="flex items-center gap-2 px-4">
                                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            <Tabs defaultValue="overview" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="analytics" >
                                        Analytics
                                    </TabsTrigger>
                                    <TabsTrigger value="reports" >
                                        Reports
                                    </TabsTrigger>
                                    <TabsTrigger value="notifications" >
                                        Notifications
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="space-y-4">
                                    <div className="flex flex-col gap-4">
                                        <Card >
                                            <CardHeader>
                                                <CardTitle className="text-lg">Your assessments</CardTitle>
                                            </CardHeader>
                                            <CardContent>

                                            </CardContent>
                                        </Card>
                                        <ReviewGroupCard />
                                    </div>
                                </TabsContent>
                            </Tabs>                            <div className="min-h-[100vh] flex-1 rounded-xl bg-zinc-100/50 md:min-h-min dark:bg-zinc-800/50" />
                        </div>
                    </ModerationProvider>
                </WebsocketProvider>
            </SidebarInset>
        </SidebarProvider >
    );
}
