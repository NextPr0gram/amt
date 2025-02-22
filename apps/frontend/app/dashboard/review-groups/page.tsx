import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/review-groups-page/data-table";
import { columns, ReviewGroup } from "@/components/review-groups-page/columns";

export default function Page() {
    const data: ReviewGroup[] = [
        {
            year: "1",
            group: "A",
            moduleCode: "CS1OOP",
            hasExam: true,
            moduleTutors: ["N Powell", "L Hakobyan", "K Fatema"],
            convener: "L Hakobyan",
            button: "Edit",
        },
        {
            year: "2",
            group: "A",
            moduleCode: "CS2HCI",
            hasExam: true,
            moduleTutors: ["N Powell", "L Hakobyan", "K Fatema"],
            convener: "N Powell",
            button: "Edit",
        },
        {
            year: "2",
            group: "B",
            moduleCode: "CS2IAD",
            hasExam: true,
            moduleTutors: ["N Powell", "L Hakobyan", "K Fatema"],
            convener: "L Hakobyan",
            button: "Edit",
        },
        {
            year: "3",
            group: "A",
            moduleCode: "CS3SMC",
            hasExam: true,
            moduleTutors: ["N Powell", "L Hakobyan", "K Fatema"],
            convener: "K Fatema",
            button: "Edit",
        },
        {
            year: "3",
            group: "B",
            moduleCode: "CS3IVP",
            hasExam: true,
            moduleTutors: ["N Powell", "L Hakobyan", "K Fatema"],
            convener: "K Fatema",
            button: "Edit",
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
                                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Review groups</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <DataTable columns={columns} data={data} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
