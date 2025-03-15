import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/review-groups-page/data-table";
import { ReviewGroupsProvider } from "@/components/review-groups-page/review-groups-context";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReviewGroupsModal from "@/components/review-groups-page/review-groups-modal";
import { WebsocketProvider } from "@/components/websocket-context";

export default function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <WebsocketProvider>
                    <DateStage />
                    <ReviewGroupsProvider>
                        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
                            <div className="flex items-center gap-2">
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Review groups</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="ml-auto">
                                        Create review group
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <ReviewGroupsModal type="add" />
                                </DialogContent>
                            </Dialog>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                            <DataTable />
                        </div>
                    </ReviewGroupsProvider>
                </WebsocketProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}
