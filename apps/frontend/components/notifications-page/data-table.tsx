"use client";

import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { DataTablePagination } from "../data-table/data-table-pagination";
import { DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { protectedFetch } from "@/utils/protected-fetch";
import { Bell, Divide, TriangleAlert } from "lucide-react";

type Notification = {
    id: number;
    type: "info" | "warning" | "error";
    title: string;
    message: string;
    createdAt: string;
};

type NotificationAPIResponse = {
    notification: {
        id: number,
        title: string,
        message: string,
        notificationType: {
            name: string,
        },
        createdAt: Date
    }
}


const columns: ColumnDef<Notification>[] = [
    {
        accessorKey: "Type",
        cell: ({ row }) => {
            const data = row.original; // Assuming the notification data is in row.original
            switch (data.type) {
                case "info":
                    return <Bell className="size-5 mx-2" />; // Return the JSX here
                case "warning":
                    return <TriangleAlert className="size-5 mx-2" />; // Return the JSX here
                case "error":
                    return <div>Error</div>; // Return a message or JSX for error type
                default:
                    return null; // Return null if the type is unrecognized
            }
        },
    },
    {
        accessorKey: "Title",
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.title}
                </div>
            );
        },
    },
    {
        accessorKey: "Message",
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.message || "-"}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Time"
    },
];

export function DataTable() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<number>();
    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await protectedFetch("/user/notifications", "GET");
            const notifications: Notification[] = res.data.map((notification: NotificationAPIResponse) => ({
                id: notification.notification.id,
                title: notification.notification.title,
                message: notification.notification.message,
                createdAt: new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }).format(new Date(notification.notification.createdAt)),
            }));
            setNotifications(notifications);
        };
        fetchNotifications();
    }, []);

    const table = useReactTable({
        data: notifications,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <Dialog>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No notifications.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Dialog>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
