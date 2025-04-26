import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModulesProvider } from "@/components/modules-and-assessments-page/module-context";
import ModuleModal from "@/components/modules-and-assessments-page/module-modal";
import { ModulesDataTable } from "@/components/modules-and-assessments-page/modules-data-table";
import { AssessmentsDataTable } from "@/components/modules-and-assessments-page/assessments-data-table";
import AssessmentModal from "@/components/modules-and-assessments-page/assessment-modal";
import { AssessmentsProvider } from "@/components/modules-and-assessments-page/assessment-context";
import { DemoDateProvider } from "@/components/contexts/demo-date-context";

export default function Page() {
    return (
        <SidebarProvider>
            <DemoDateProvider>
                <AppSidebar />
                <SidebarInset>
                    <WebsocketProvider>
                        <ModerationProvider>
                            <DateStage />
                            <ModulesProvider>
                                <AssessmentsProvider>
                                    <Tabs defaultValue="modules" className="px-4">
                                        <TabsContent value="modules" className="mt-0">
                                            <header className="flex h-16 shrink-0 items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <h1 className="text-2xl font-bold tracking-tight">Modules</h1>
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" className="ml-auto">
                                                            Add module
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-[750px]">
                                                        <ModuleModal type="add" />
                                                    </DialogContent>
                                                </Dialog>
                                            </header>
                                        </TabsContent>
                                        <TabsContent value="assessments" className="mt-0">
                                            <header className="flex h-16 shrink-0 items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <h1 className="text-2xl font-bold tracking-tight">Assesments</h1>
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" className="ml-auto">
                                                            Add assessment
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <AssessmentModal type="add" />
                                                    </DialogContent>
                                                </Dialog>
                                            </header>
                                        </TabsContent>
                                        <TabsList>
                                            <TabsTrigger value="modules">Modules</TabsTrigger>
                                            <TabsTrigger value="assessments">Assessments</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="modules" className="space-y-4">
                                            <div className="flex flex-1 flex-col gap-4 pt-2">
                                                <ModulesDataTable />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="assessments" className="space-y-4">
                                            <div className="flex flex-1 flex-col gap-4 pt-2">
                                                <AssessmentsDataTable />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </AssessmentsProvider>
                            </ModulesProvider>
                        </ModerationProvider>
                    </WebsocketProvider>
                </SidebarInset>
            </DemoDateProvider>
        </SidebarProvider>
    );
}
