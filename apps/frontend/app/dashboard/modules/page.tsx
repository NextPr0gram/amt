import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Module } from "@components/modules-page/columns";
import { DataTable } from "@/components/modules-page/data-table";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { columns } from "@/components/modules-page/columns";

export default function Page() {
    // https://ui.shadcn.com/docs/components/data-table#basic-table

    const data: Module[] = [
        {
            code: "CS1OOP",
            name: "Object Oriented Programming",
            year: "1",
            lead: "N Powell",
        },
        {
            code: "CS2HCI",
            name: "Human Computer Interaction",
            year: "2",
            lead: "L Hakobyan",
        },
        {
            code: "CS3SMC",
            name: "System management, access and control",
            year: "3",
            lead: "K Fatema",
        },
    ];
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DateStage />
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
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
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <DataTable />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
