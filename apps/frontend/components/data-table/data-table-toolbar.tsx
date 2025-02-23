"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterColumn: string;
    filterTitle: string;
    filterOptions: { label: string; value: string }[];
    seachInputPlaceholder: string;
}

export function DataTableToolbar<TData>({ table, filterColumn, filterTitle, filterOptions, seachInputPlaceholder }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between pb-4">
            <div className="flex flex-1 items-center justify-between space-x-2">
                <Input placeholder={seachInputPlaceholder} value={table.getState().globalFilter ?? ""} onChange={(e: { target: { value: string } }) => table.setGlobalFilter(String(e.target.value))} className="max-w-sm" />
                <div className="flex items-center space-x-2">
                    {table.getColumn(filterColumn) && <DataTableFacetedFilter column={table.getColumn(filterColumn)} title={filterTitle} options={filterOptions} />}

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
