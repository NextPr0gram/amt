"use client";

import { flexRender, getCoreRowModel, useReactTable, getGroupedRowModel, getExpandedRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { Fragment, useState } from "react";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { ReviewGroup, useReviewGroups } from "./review-groups-context";
import ReviewGroupsModal from "./review-groups-modal";
import { ChevronDown, ChevronRight } from "lucide-react";

// Columns are define the core of what the table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.
const columns: ColumnDef<ReviewGroup>[] = [
    {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => {
            // For grouped rows, show just the year without the group
            if (row.getIsGrouped()) {
                return (
                    <div className="flex items-center">
                        <Button variant="ghost" size="sm" onClick={() => row.toggleExpanded()} className="mr-2 p-0">
                            {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                        <span>{row.getValue("year")}</span>
                    </div>
                );
            }
            return row.original.year + " " + row.original.group;
        },
        enableGrouping: true,
    },
    {
        accessorKey: "moduleCodeAndTutors",
        header: () => (
            <div className="grid grid-cols-2 grid-rows-1 gap-4">
                <div>Module Code</div>
                <div>Module Lead/Tutor</div>
            </div>
        ),
        cell: ({ row }) => {
            if (row.getIsGrouped()) return null;

            return (
                <Fragment>
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
                </Fragment>
            );
        },
    },
    {
        accessorKey: "convener",
        header: "Convener",
        cell: ({ row }) => {
            if (row.getIsGrouped()) return null;

            return (
                <div className="flex flex-col justify-evenly gap-2">
                    <div>
                        <div className="inline xl:hidden">{row.original.shortConvener}</div>
                        <div className="hidden xl:inline">{row.original.convener}</div>
                    </div>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "", // Empty header for the actions column
        cell: ({ row }) => {
            if (row.getIsGrouped()) return null;
            return (
                <DialogTrigger asChild>
                    <Button variant={"link"} size="sm" className="ml-auto" onClick={() => setSelectedReviewGroup(row.original.id)}>
                        View
                    </Button>
                </DialogTrigger>
            );
        },
    },
];

export function DataTable() {
    const { reviewGroups } = useReviewGroups();
    const [selectedReviewGroup, setSelectedReviewGroup] = useState<number>();
    

    const table = useReactTable({
        data: reviewGroups,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        autoResetPageIndex: false,
        initialState: {
            grouping: ["year"],
            expanded: true,
        },
    });

    // Calculate the total number of columns including the actions column
    const totalColumnCount = columns.length;

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <Dialog>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={row.getIsGrouped() ? "bg-slate-100" : ""}>
                                        {row.getIsGrouped() ? (
                                            // Sub header
                                            <TableCell className="py-1" colSpan={totalColumnCount}>
                                                {flexRender(row.getVisibleCells()[0].column.columnDef.cell, row.getVisibleCells()[0].getContext())}
                                            </TableCell>
                                        ) : (
                                            row.getVisibleCells().map((cell) => <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={totalColumnCount} className="h-24 text-center">
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
