"use client"

import {ColumnDef} from "@tanstack/react-table"
import {User} from "@/types/user";
import {MoreHorizontal} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react";
import {Project} from "@/types/project";
import {toast} from "sonner";
import {TeamMember} from "@/types/team-member";
import {TeamMemberRole, TeamMemberStatus} from "@/types/enums/team-member";
import {Semester} from "@/types/semester";


type SetProjectFunction = React.Dispatch<React.SetStateAction<Project | null>>;

interface ColumnsStudentTableProps {
    setProject: SetProjectFunction;
    currentSemester: Semester;
    setTeamMemberUpdated: React.Dispatch<React.SetStateAction<TeamMember[]>>
}


export const columnsStudentTable = ({ setProject, currentSemester, setTeamMemberUpdated}: ColumnsStudentTableProps): ColumnDef<User>[] => [
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
        accessorKey: "lastName",
        header: "Họ",
    },
    {
        accessorKey: "firstName",
        header: "Tên"
    },
    {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
            const user = row.original;
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
                        <DropdownMenuItem
                            onClick={() => {
                                setProject((prevState) => {
                                    if (!prevState) {
                                        toast.error("Chưa chọn nhóm để thêm");
                                        return prevState;
                                    }
                                    const updatedTeamMembers = [...(prevState.teamMembers || [])];
                                    if (prevState.teamMembers && currentSemester.maxTeamSize <= prevState.teamMembers.length) {
                                        toast.error("Số lượng thành viên đã tới giới hạn")
                                        return prevState;
                                    }
                                    updatedTeamMembers.push({
                                        user: user,
                                        userId: user.id,
                                        status: TeamMemberStatus.InProgress,
                                        role: updatedTeamMembers.length == 0 ? TeamMemberRole.Leader : TeamMemberRole.Member
                                    } as TeamMember);

                                    if (updatedTeamMembers.length == 1){
                                        return {
                                            ...prevState,
                                            teamMembers: updatedTeamMembers,
                                            leaderId: user.id,
                                        };
                                    }
                                    return {
                                        ...prevState,
                                        teamMembers: updatedTeamMembers,
                                    };
                                });
                                setTeamMemberUpdated((prevState) => {
                                    const updatedTeamMembers = [...(prevState || [])];
                                    updatedTeamMembers.push({
                                        userId: user.id,
                                        status: TeamMemberStatus.InProgress,
                                        role: TeamMemberRole.Member,
                                        isDeleted: false,
                                    } as TeamMember)
                                    return updatedTeamMembers;
                                })
                            }}
                        >
                            Thêm vào nhóm
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
