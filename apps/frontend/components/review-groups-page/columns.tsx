"use client";

import { ColumnDef } from "@tanstack/react-table";


export type ReviewGroup = {
    year: string;
    group: string;
    moduleCode: string;
    hasExam: boolean;
    moduleTutors: string[];
    convener: string;
    button: string;
};

export const columns: ColumnDef<ReviewGroup>[] = [
    {
        accessorKey: "year",
        header: "Year",
    },
    {
        accessorKey: "moduleCode",
        header: "Module Code",
    },
    {
        accessorKey: "hasExam",
        header: "Exam",
    },
    {
        accessorKey: "moduleTutors",
        header: "Module Tutors",
    },
    {
        accessorKey: "convener",
        header: "Convener",
    },
    {
        accessorKey: "button",
        header: "Button",
    },
];
