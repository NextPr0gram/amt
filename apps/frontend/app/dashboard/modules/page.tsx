import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/modules-page/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ModulesProvider } from "@/components/modules-page/module-context";
import ModuleModal from "../../../components/modules-page/module-modal";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { ModerationProvider } from "@/components/contexts/moderation-context";

export default function Page() {
    // https://ui.shadcn.com/docs/components/data-table#basic-table
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <WebsocketProvider>
                    <ModerationProvider>
                        <DateStage />
                        <ModulesProvider>
                            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                                <div className="flex items-center gap-2">
                                    <Breadcrumb>
                                        <BreadcrumbList>
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>Modules</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </BreadcrumbList>
                                    </Breadcrumb>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="ml-auto">
                                            Add module
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <ModuleModal type="add" />
                                    </DialogContent>
                                </Dialog>
                            </header>
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                <DataTable />
                            </div>
                        </ModulesProvider>
                    </ModerationProvider>
                </WebsocketProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
