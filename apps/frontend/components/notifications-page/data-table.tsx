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
import { Divide } from "lucide-react";

type Notification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
};

const columns: ColumnDef<Notification>[] = [
    {
        accessorKey: "id",
        cell: ({ row }) => {
            return (
                <div>
                    <div>{row.original.title}</div>
                    <div>{row.original.message}</div>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
    },
];

export function DataTable() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<number>();
    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await protectedFetch("/user/notifications", "GET");
            setNotifications(res.data);
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

                                        <TableCell>
                                            <DialogTrigger asChild>
                                                <Button variant={"link"} size="sm" className="ml-auto" onClick={() => setSelectedNotification(row.original.id)}>
                                                    View
                                                </Button>
                                            </DialogTrigger>
                                        </TableCell>
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
