"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {DataTablePagination} from "@/app/(client)/(dashboard)/manage-review/import-csv/DataTablePagination";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import * as React from "react";
import {Button} from "@/components/ui/button";
import {Import} from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({columns,data}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters
        },

    })
    return (
        <>
            <div className="flex items-center justify-between py-4 ">
                <div className={"items-left flex gap-4 "}>
                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="project-code">Mã đề tài</Label>
                        <Input
                            placeholder="Filter mã đề tài..."
                            value={(table.getColumn("Mã đề tài")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("Mã đề tài")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="project-code">Mã nhóm</Label>
                        <Input
                            placeholder="Filter mã nhóm..."
                            value={(table.getColumn("Mã nhóm")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("Mã nhóm")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                </div>

            </div>
            <div className="rounded-md border mb-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
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
        </>
    )
}


