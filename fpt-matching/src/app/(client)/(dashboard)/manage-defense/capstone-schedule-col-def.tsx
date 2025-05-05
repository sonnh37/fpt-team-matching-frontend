"use client"

import {ColumnDef, Row} from "@tanstack/react-table"
import {
    CapstoneScheduleImportCommands
} from "@/types/models/commands/capstone-schedule/capstone-schedule-import-commands";
import {CapstoneSchedule} from "@/types/capstone-schedule";
import {DataTableColumnHeader} from "@/components/_common/data-table-api/data-table-column-header";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {useRouter} from "next/navigation";

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


const ActionCell = ({row}: {row : Row<CapstoneSchedule>}) => {
    const router = useRouter()
    console.log(row)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                    router.push(`manage-defense/defense-details?defenseId=${row.original.id}`)
                }}>Xem chi tiết</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

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
                <div>{project?.topic?.topicCode}</div>
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
                <div className={"flex justify-center"}>{project?.topic?.ideaVersion?.englishName}</div>
            )
        }
    },
    {
        header: "GVHD",
        id: "mentor-name",
        accessorFn: (row) => {
          return   row.project?.topic?.ideaVersion?.idea?.mentor?.username + "" + row.project?.topic?.ideaVersion?.idea?.subMentor && " - " + row.project?.topic?.ideaVersion?.idea?.subMentor?.username
        },
        cell: ({row}) => {
            const project = row.original.project;
            return (
                <div>
                    {project?.topic?.ideaVersion?.idea?.mentor?.username}{project?.topic?.ideaVersion?.idea?.subMentor && " - " + project?.topic.ideaVersion?.idea?.subMentor?.username}
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
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({row}) => {
            return (
                <ActionCell row={row} />
            )
        }
    },
]
