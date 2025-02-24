"use client";

import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { Module, useModules } from "@/components/modules-page/module-context";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { useState } from "react";
import { DataTablePagination } from "../data-table/data-table-pagination";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import ModuleModal from "./module-modal";

// Columns are define the core of what the table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
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
        filterFn: "arrIncludesSome",
    },
    {
        accessorKey: "lead",
        header: "Module Lead",
    },
    {
        id: "edit",
        enableHiding: false,
    },
];

const filterOptions = [
    {
        label: "Year 1",
        value: "1",
    },
    {
        label: "Year 2",
        value: "2",
    },
    {
        label: "Year 3",
        value: "3",
    },
];

export function DataTable() {
    const { modules } = useModules();
    const [globalFilter, setGlobalFilter] = useState([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);

    const table = useReactTable({
        data: modules,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            globalFilter,
        },
    });

    return (
        <div>
            <DataTableToolbar table={table} filterColumn="year" filterTitle="Year" filterOptions={filterOptions} seachInputPlaceholder="Search module" />
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
                                        {/* View Button to trigger dialog for module details */}
                                        <TableCell>
                                            <DialogTrigger asChild>
                                                <Button variant={"link"} size="sm" className="ml-auto" onClick={() => setSelectedModule(row.original as Module)}>
                                                    View
                                                </Button>
                                            </DialogTrigger>
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
                        <DialogContent>
                            <ModuleModal type="viewOrEdit" module={selectedModule as Module} />
                        </DialogContent>
                    </Dialog>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
