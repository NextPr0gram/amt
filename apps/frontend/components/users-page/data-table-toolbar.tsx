"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}
const roles = [
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

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between pb-4">
            <div className="flex flex-1 items-center justify-between space-x-2">
                <Input placeholder="Search user" value={table.getState().globalFilter ?? ""} onChange={(e: { target: { value: string } }) => table.setGlobalFilter(String(e.target.value))} className="max-w-sm" />
                <div className="flex items-center space-x-2">
                    {table.getColumn("roles") && <DataTableFacetedFilter column={table.getColumn("roles")} title="Role" options={roles} />}

                    {isFiltered && (
                        <Button size="sm" variant="ghost" onClick={() => table.resetColumnFilters()} className="px-2 lg:px-3">
                            Reset
                            <X />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
