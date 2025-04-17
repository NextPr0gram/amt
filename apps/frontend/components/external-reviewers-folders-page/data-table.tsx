"use client";

import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { ERFolder, useERFolders } from "./er-folders-context";
import { Button } from "@/components/ui/button";
import { protectedFetch } from "@/utils/protected-fetch";
import { notify } from "../contexts/websocket-context";

export const columns: ColumnDef<ERFolder>[] = [
    {
        accessorKey: "email",
        header: "Email/Folder Name",
    },
    {
        accessorKey: "folderId",
        header: "Folder Link",
        cell: (cell) => {
            return (
                <Button variant="link" className="p-0">
                    <a href={`https://app.box.com/folder/${cell.getValue()}`} target="_blank" rel="noopener noreferrer">
                        {`app.box.com/folder/${cell.getValue()}`}
                    </a>
                </Button>
            );
        },
    },
];

export function DataTable() {
    const { erFolders, fetchERFolders } = useERFolders();

    const table = useReactTable({
        data: erFolders,
        columns,
        getCoreRowModel: getCoreRowModel(),
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
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            size={"sm"}
                                            onClick={async () => {
                                                const res = await protectedFetch("/er/folders", "DELETE", {
                                                    id: row.original.id,
                                                });
                                                if (res.status === 200) {
                                                    notify("info", "Folder deleted successfully");
                                                    fetchERFolders();
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
