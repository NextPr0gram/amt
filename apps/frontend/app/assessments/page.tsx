import { AppSidebar } from "@/components/app-sidebar";
import { AssessmentsProvider } from "@/components/assessments-page/assessment-context";
import AssessmentModal from "@/components/assessments-page/assessment-modal";
import { DataTable } from "@/components/assessments-page/data-table";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { DateStage } from "@/components/date-stage";
import { ModulesProvider } from "@/components/modules-page/module-context";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <WebsocketProvider>
                    <ModerationProvider>
                        <DateStage />
                        <ModulesProvider>
                            <AssessmentsProvider>
                                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
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
                                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                    <DataTable />
                                </div>
                            </AssessmentsProvider>
                        </ModulesProvider>
                    </ModerationProvider>
                </WebsocketProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
