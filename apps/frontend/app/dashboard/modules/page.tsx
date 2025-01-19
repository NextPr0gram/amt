import { AppSidebar } from "@/components/app-sidebar";
import { DateStage } from "@/components/date-stage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
    const modules = [
        {
            moduleCode: "INV001",
            moduleName: "Paid",
            year: "$250.00",
            moduleLead: "Credit Card",
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
                    <Table>
                        <TableCaption>A list of your recent invoices.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {modules.map((module) => (
                                <TableRow key={module.moduleCode}>
                                    <TableCell className="font-medium">{module.moduleCode}</TableCell>
                                    <TableCell>{module.moduleName}</TableCell>
                                    <TableCell>{module.year}</TableCell>
                                    <TableCell className="text-right">{module.moduleLead}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Total</TableCell>
                                <TableCell className="text-right">$2,500.00</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
