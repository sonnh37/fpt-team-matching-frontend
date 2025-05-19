"use client"

import { ColumnDef } from "@tanstack/react-table"
import {User} from "@/types/user";
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columnsStudentTable: ColumnDef<User>[] = [
    {
        header: "STT",
        cell: ({row}) => {
            const stt = parseInt(row.id) + 1
            return <div>{stt}</div>
        }
    },
    {
        accessorKey: "code",
        header: "Mã người dùng",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "firstName",
        header: "Họ",
    },
    {
        accessorKey: "lastName",
        header: "Tên"
    },
    {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
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
                        <DropdownMenuItem>Thêm vào nhóm</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
