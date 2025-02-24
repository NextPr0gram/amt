"use client";

import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { User, useUsers } from "./user-context";
import { useState } from "react";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DataTablePagination } from "../data-table/data-table-pagination";
import { RoleBadge } from "../ui/roleBadge";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "roles",
        header: "Roles",
        // convert split array to individual strings
        accessorFn: (row) => row.roles.join(", "), // Convert array → string
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.roles.map((role: string, index: number) => (
                    <RoleBadge key={index} role={role as "Assessment Lead" | "Module Lead" | "Module Tutor"} />
                ))}
            </div>
        ),
        filterFn: "arrIncludesSome",
        enableColumnFilter: true,
    },
];

const filterOptions = [
    {
        label: "Assessment Lead",
        value: "Assessment Lead",
    },
    {
        label: "Module Lead",
        value: "Module Lead",
    },
    {
        label: "Module Tutor",
        value: "Module Tutor",
    },
];

const getCustomFacetMap = (data: User[]) => {
    const facetMap = new Map<string, number>();

    data.forEach((user) => {
        user.roles.forEach((role) => {
            facetMap.set(role, (facetMap.get(role) || 0) + 1);
        });
    });

    return facetMap;
};

export function DataTable() {
    const { users } = useUsers();
    const [globalFilter, setGlobalFilter] = useState([]);

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            globalFilter,
        },
    });

    return (
        <div>
            <DataTableToolbar table={table} filterColumn="roles" filterTitle="Roles" filterOptions={filterOptions} seachInputPlaceholder="Search user" customFacetMap={getCustomFacetMap(users)} />
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
            <DataTablePagination table={table} />
        </div>
    );
}
