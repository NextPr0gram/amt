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
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { protectedFetch } from "@/utils/protected-fetch";

type ModuleIdentifier = {
    reviewGroupId: number
    moduleCode: string
}

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
    const { reviewGroups, fetchReviewGroups } = useReviewGroups();
    const [selectedReviewGroup, setSelectedReviewGroup] = useState<number>();
    const [hoveredModule, setHoveredModule] = useState<ModuleIdentifier | null>(null)

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

    const renderModuleCodeAndTutors = (row: any) => {
        if (row.getIsGrouped()) return null;

        return (
            <Fragment>
                {row.original.modules.map((module) => {
                    const isHovered =
                        hoveredModule !== null &&
                        hoveredModule.reviewGroupId === row.original.id &&
                        hoveredModule.moduleCode === module.code;

                    return (
                        <div
                            className="grid grid-cols-2 grid-rows-1 gap-4 py-2 relative"
                            key={module.code}
                            onMouseEnter={() => setHoveredModule({ reviewGroupId: row.original.id, moduleCode: module.code })}
                            onMouseLeave={() => setHoveredModule(null)}
                        >
                            {/* Module code and name */}
                            <div className="self-center">
                                {module.code}
                                <div className="hidden xl:inline"> - {module.name}</div>
                            </div>

                            {/* Module lead and tutors */}
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

                            {/* Overlay with delete button */}
                            {isHovered && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white  z-10">
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="flex items-center gap-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            deleteModule(module.id,);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </Fragment>
        );
    };

    const deleteModule = async (moduleId: number) => {
        const res = await protectedFetch("/review-groups", "DELETE", {
            moduleId
        })

        fetchReviewGroups();
    }

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
                                            row.getVisibleCells().map((cell) => <TableCell key={cell.id}>
                                                {cell.column.id === "moduleCodeAndTutors"
                                                    ? renderModuleCodeAndTutors(row)
                                                    : flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>)
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
