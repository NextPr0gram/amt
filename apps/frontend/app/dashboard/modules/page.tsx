import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/modules-page/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ButtonWithModal from "../../../components/button-with-modal";
import AddModuleModal from "../../../components/modules-page/add-module-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
    // https://ui.shadcn.com/docs/components/data-table#basic-table
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DateStage />
                <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                    <div className="flex items-center gap-2">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Modules</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>{" "}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className="ml-auto">
                                Add module
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add module</DialogTitle>
                            <AddModuleModal />
                        </DialogContent>
                    </Dialog>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <DataTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
