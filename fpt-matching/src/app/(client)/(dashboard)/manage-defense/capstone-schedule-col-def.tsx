"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    CapstoneScheduleImportCommands
} from "@/types/models/commands/capstone-schedule/capstone-schedule-import-commands";
import {CapstoneSchedule} from "@/types/capstone-schedule";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const capstoneScheduleColumn: ColumnDef<CapstoneScheduleImportCommands>[] = [
    {
        accessorKey: "STT",
        header: "Số thứ tự",
    },
    {
        accessorKey: "Mã đề tài",
        header: "Mã đề tài",
    },
    {
        accessorKey: "Tên đề tài tiếng anh",
        header: "Tên đề tài tiếng anh",
    },
    {
        accessorKey: "Date",
        header: "Ngày"
    },
    {
        accessorKey: "Time",
        header: "Thời gian"
    },
    {
        accessorKey: "Hall Name",
        header: "Địa điểm",
    }
]

export const capstoneScheduleSchemaColumns: ColumnDef<CapstoneSchedule>[] = [
    {
        accessorKey: "project.teamCode",
        header: "Mã nhóm",
    },
    {
        accessorKey: "project.teamName",
    }
]
