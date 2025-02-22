"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "./user-context";

// This type is used to define the shape of our data.

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
];
