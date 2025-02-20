"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { protectedFetch } from "@/utils/protected-fetch";

// This type is used to define the shape of our data.
type Module = {
    code: string;
    name: string;
    year: "1" | "2" | "3" | "PG";
    lead: string;
};

type ModuleAPIResponse = {
    id: string;
    name: string;
    moduleLead: {
        firstName: string;
        lastName: string;
    };
};

const columns: ColumnDef<Module>[] = [
    {
        accessorKey: "code",
        header: "Module Code",
    },
    {
        accessorKey: "name",
        header: "Module Name",
    },
    {
        accessorKey: "year",
        header: "Year",
    },
    {
        accessorKey: "lead",
        header: "Module Lead",
    },
];
// Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.

export function DataTable() {
    const [modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
        const fetchModules = async () => {
            const res = await protectedFetch("/modules", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const resData = res.data.map((module: ModuleAPIResponse) => ({
                code: module.id,
                name: module.name,
                year: "1",
                lead: module.moduleLead.firstName + " " + module.moduleLead.lastName,
            }));
            setModules(resData);
        };
        fetchModules();
    }, []);

    const table = useReactTable({
        data: modules,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
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
    );
}
