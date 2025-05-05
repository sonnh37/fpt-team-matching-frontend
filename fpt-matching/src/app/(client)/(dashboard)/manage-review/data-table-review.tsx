"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
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
import { Table as PaginationTable } from "@tanstack/react-table"
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import * as React from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"



interface DataTablePaginationProps<TData> {
    table: PaginationTable<TData>
}

function DataTablePagination<TData>({
                                               table,
                                           }: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}


export function ReviewDataTable<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    );
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        },
    });
    const [date, setDate] = React.useState<Date>()
    const [status, setStatus] = React.useState<string|undefined>("")
    return (
        <>
            {/*-------------- Filter part -------------*/}
            <div className="flex items-center justify-between py-4 ">
                <div className={"items-left flex gap-4 "}>
                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="team-code">Mã nhóm</Label>
                        <Input
                            id={"team-code"}
                            placeholder="Filter mã nhóm..."
                            value={(table.getColumn("teamCode")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("teamCode")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="idea-code">Mã đề tài</Label>
                        <Input
                            id={"idea-code"}
                            placeholder="Filter mã đề tài..."
                            value={(table.getColumn("ideaCode")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("ideaCode")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="vietnamese">Tên tiếng Việt</Label>
                        <Input
                            id={"vietnamese"}
                            placeholder="Filter Vietnamese name..."
                            value={(table.getColumn("vietnameseName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("vietnameseName")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="project-code">Tên tiếng Anh/Nhật</Label>
                        <Input
                            placeholder="Filter tên tiếng Anh/Nhật..."
                            value={(table.getColumn("englishName")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("englishName")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>

                    {/*---------Filter Review Date -------------*/}
                    <div className={"w-auto flex flex-col pt-1 gap-1"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="project-code">Ngày review</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Chọn ngày</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={(table.getColumn("reviewDate")?.getFilterValue() as Date) ?? date}
                                    onSelect={(date) => {
                                        table.getColumn("reviewDate")?.setFilterValue(date)
                                        setDate(date)
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="room">Phòng</Label>
                        <Input
                            id={"room"}
                            placeholder="Filter phòng..."
                            value={(table.getColumn("room")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("room")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>
                    <div className={"w-auto"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="Slot">Slot</Label>
                        <Input
                            id={"slot"}
                            placeholder="Filter slot..."
                            value={(table.getColumn("slot")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("slot")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>

                    <div className={"w-auto flex flex-col pt-1 gap-1"}>
                        <Label className={"text-xs pl-2 font-bold text-gray-600"} htmlFor="Slot">Status</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{status == "" ? "Filter status" : status }</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Select status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={(table.getColumn("status")?.getFilterValue() as string) ?? status}
                                    onValueChange={(event) =>
                                       {
                                           table.getColumn("status")?.setFilterValue(event)
                                           setStatus(event)
                                       }
                                    }
                                >
                                    <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Assigned">Đã có</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Not yet">Chưa có</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

            </div>

            {/*------- Table part --------------*/}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            style={{
                                                minWidth: header.column.columnDef.size,
                                                maxWidth: header.column.columnDef.size,
                                            }}
                                            key={header.id}>
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
                                        <TableCell
                                            style={{
                                                minWidth: cell.column.columnDef.size,
                                                maxWidth: cell.column.columnDef.size,
                                            }}
                                            key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length} className="h-24 text-center">
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/*----- Pagination part ------*/}
            <DataTablePagination table={table} />
        </>
    )
}
