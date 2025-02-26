"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { ReviewGroup, useReviewGroups } from "./review-groups-context";
import ReviewGroupsModal from "./review-groups-modal";

// Columns are define the core of what the table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
const columns: ColumnDef<ReviewGroup>[] = [
    {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => row.original.year + row.original.group,
    },
    {
        accessorKey: "module",
        // make the header a div with a grid
        header: () => (
            <div className="grid grid-cols-2 grid-rows-1 gap-4">
                <div>Module Code</div>
                <div>Module Lead</div>
            </div>
        ),
        // If screen width is small show only module code else show modue code - module name
        cell: ({ row }) => (
            <div>
                {row.original.modules.map((module) => (
                    <div className="grid grid-cols-2 grid-rows-1 gap-4 py-2" key={module.code}>
                        <div className="self-center ">
                            {module.code}
                            <div className="hidden xl:inline"> - {module.name}</div>
                        </div>
                        <div className="self-center">
                            <div className="font-bold inline xl:hidden">
                                {module.shortNameML}
                                {module.moduleTutors.length > 0 ? ", " : ""}
                            </div>
                            <div className="font-bold hidden xl:inline">
                                {module.moduleLead}
                                {module.moduleTutors.length > 0 ? ", " : ""}
                            </div>
                            <div className="inline xl:hidden">{module.shortNameMT.join(", ")}</div>
                            <div className="hidden xl:inline">{module.moduleTutors.join(", ")}</div>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },

    {
        accessorKey: "convener",
        header: "Convener",
        cell: ({ row }) => (
            <div className="flex flex-col justify-evenly gap-2">
                <div>
                    <div className="inline xl:hidden">{row.original.shortConvener}</div>
                    <div className="hidden xl:inline">{row.original.convener}</div>
                </div>
            </div>
        ),
    },
    {
        id: "edit",
        enableHiding: false,
    },
];

export function DataTable() {
    const { reviewGroups } = useReviewGroups();
    const [selectedReviewGroup, setSelectedReviewGroup] = useState<number>();

    const table = useReactTable({
        data: reviewGroups,
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
                    <Dialog>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell className="py-2" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                        {/* View Button to trigger dialog for reviewGroup details */}
                                        <TableCell >
                                            <DialogTrigger asChild>
                                                <Button variant={"link"} size="sm" className="ml-auto" onClick={() => setSelectedReviewGroup(row.original.id)}>
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
                            <ReviewGroupsModal type="viewOrEdit" reviewGroupId={selectedReviewGroup} />
                        </DialogContent>
                    </Dialog>
                </Table>
            </div>
        </div>
    );
}
