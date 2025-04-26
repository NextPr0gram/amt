import { AppSidebar } from "@/components/app-sidebar";
import { DemoDateProvider } from "@/components/contexts/demo-date-context";
import { ModerationProvider } from "@/components/contexts/moderation-context";
import { WebsocketProvider } from "@/components/contexts/websocket-context";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/users-page/data-table";
import { UsersProvider } from "@/components/users-page/user-context";

export default function Page() {
    return (
        <SidebarProvider>
            <DemoDateProvider>
                <AppSidebar />
                <SidebarInset>
                    <WebsocketProvider>
                        <ModerationProvider>
                            <DateStage />
                            <header className="flex h-16 shrink-0 items-center gap-2">
                                <div className="flex items-center gap-2 px-4">
                                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                                </div>
                            </header>
                            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                                <UsersProvider>
                                    <DataTable />
                                </UsersProvider>
                            </div>
                        </ModerationProvider>
                    </WebsocketProvider>
                </SidebarInset>
            </DemoDateProvider>
        </SidebarProvider>
    );
}
