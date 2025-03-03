import { AppSidebar } from "@/components/app-sidebar";
import { AssessmentsProvider } from "@/components/assessments-page/assessment-context";
import AssessmentModal from "@/components/assessments-page/assessment-modal";
import { DataTable } from "@/components/assessments-page/data-table";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DateStage />
                <AssessmentsProvider>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Assessments</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
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
            </SidebarInset>
        </SidebarProvider>
    );
}
