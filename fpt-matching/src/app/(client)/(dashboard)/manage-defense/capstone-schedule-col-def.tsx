"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
    CapstoneScheduleImportCommands
} from "@/types/models/commands/capstone-schedule/capstone-schedule-import-commands";
import {CapstoneSchedule} from "@/types/capstone-schedule";
import {DataTableColumnHeader} from "@/components/_common/data-table-api/data-table-column-header";

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
        accessorKey: "Ngày",
        header: "Ngày"
    },
    {
        accessorKey: "Thời gian",
        header: "Thời gian"
    },
    {
        accessorKey: "Hội trường",
        header: "Hội trường",
    }
]

export const capstoneScheduleSchemaColumns: ColumnDef<CapstoneSchedule>[] = [
    {
        header: "Mã nhóm",
        id: "team-code",
        accessorKey: "project.teamCode",
        cell: ({row}) => {
            // const project = row.getValue<Project>("project");
            const project = row.original.project;

            return project?.teamCode
        }
    },
    {
        header: "Mã đề tài",
        id: "idea-code",
        accessorKey: "project.idea.ideaCode",
        cell: ({row}) => {
            const project = row.original.project;
            return (
                <div>{project!.idea?.ideaCode}</div>
            )
        }
    },
    {
        header: ({column}) => (
            <DataTableColumnHeader className={"flex justify-center items-center"} column={column} title={"Tên đề tài tiếng anh"} />
        ),
        id: "idea-name",
        accessorKey: "project.idea.englishName",
        cell: ({row}) => {
            const project = row.original.project;
            return (
                <div className={"flex justify-center"}>{project?.idea?.englishName}</div>
            )
        }
    },
    {
        header: "GVHD",
        id: "mentor-name",
        accessorFn: (row) => {
          return   row.project?.idea?.mentor?.username + "" + row.project?.idea?.subMentor && " - " + row.project?.idea?.subMentor?.username
        },
        cell: ({row}) => {
            const project = row.original.project;
            return (
                <div>
                    {project?.idea?.mentor?.username}{project?.idea?.subMentor && " - " + project?.idea?.subMentor?.username}
                </div>
            )
        }
    },
    {
        header: ({column}) => (
            <DataTableColumnHeader className={"flex justify-center items-center"} column={column} title={"Giờ"} />
        ),
        accessorKey: "time",
        id: "time",
        cell: ({row}) => {
            const time = row.original.time;
            return (
                <div className={"flex justify-center"}>{time}</div>
            )
        }
    },
    {
        header: "Ngày",
        id: "date",
        accessorFn: (row) => {

          return new Date(row.date!).toLocaleDateString("en-GB")
        },
        cell: ({row}) => {
            const date = new Date(row.original.date!)
            const newdate = new Date(date).toLocaleDateString("en-GB")
            return (
                <div>{newdate}</div>
            )
        }
    },
    {
        header: "Địa điểm",
        accessorKey: "hallName"
    }
]
