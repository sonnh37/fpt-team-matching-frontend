"use client"

import { ColumnDef } from "@tanstack/react-table"
import {FileData} from "@/app/(client)/(dashboard)/manage-review/import-csv/FileData";
import { Button } from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columnsFileCsv: ColumnDef<FileData>[] = [
    {
        accessorKey: "STT",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    STT
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Mã đề tài",
        header: "Mã đề tài",
    },
    {
        accessorKey: "Mã nhóm",
        header: "Mã nhóm",
    },
    {
        accessorKey: "Tên đề tài Tiếng Anh/ Tiếng Nhật",
        header: "Tên đề tài Tiếng Anh/ Tiếng Nhật",
    },
    {
        accessorKey: "Tên đề tài Tiếng Việt",
        header: "Tên đề tài Tiếng Việt",
    },
    {
        accessorKey: "GVHD",
        header: "GVHD",
    },
    {
        accessorKey: "GVHD1",
        header: "GVHD1",
    },
    {
        accessorKey: "GVHD2",
        header: "GVHD2",
    },
    {
        accessorKey: "Reviewer 1",
        header: "Reviewer 1",
    },
    {
        accessorKey: "Reviewer 2",
        header: "Reviewer 2",
    },
    {
        accessorKey: "Date",
        header: "Date",
    },
    {
        accessorKey: "Slot",
        header: "Slot",
    },
    {
        accessorKey: "Room",
        header: "Room",
    },
    {
        accessorKey: "Result",
        header: "Result",
    }
]
