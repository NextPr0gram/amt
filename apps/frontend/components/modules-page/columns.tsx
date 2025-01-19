"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
export type Module = {
    code: string;
    name: string;
    year: "1" | "2" | "3" | "PG";
    lead: string;
};

export const columns: ColumnDef<Module>[] = [
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
