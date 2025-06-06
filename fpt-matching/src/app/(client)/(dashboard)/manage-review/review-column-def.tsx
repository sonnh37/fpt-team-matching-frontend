"use client"

import {ColumnDef, Row} from "@tanstack/react-table"
import {Review} from "@/types/review";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {useRouter} from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const ActionCell = ({row}: {row :Row<Review>}) => {
        const router = useRouter()
        const review = row.original
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        {/*<span className="sr-only">Open menu</span>*/}
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        router.push("manage-review/review-details?reviewId="+review.id)
                    }}>Xem chi tiết</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
};
export const ReviewColumns: ColumnDef<Review>[] = [
    {
        accessorKey: "number",
        header: "Review",
        size: 100
    },
    {
        accessorKey: "project.teamCode",
        id: "teamCode",
        header: "Mã nhóm",
        size: 150
    },
    {
        accessorKey: "project.topic.topicCode",
        id: "topicCode",
        header: "Mã đề tài",
        size: 150
    },
    {
        accessorKey: "project.topic.topicVersion.vietNamName",
        id: "vietnameseName",
        header: "Tên tiếng Việt",
        size: 250
    },
    {
        accessorKey: "project.topic.topicVersion.englishName",
        id: "englishName",
        header: "Tên tiếng Anh / Nhật",
        size: 250
    },
    {
        accessorKey: "reviewDate",
        header: "Ngày review",
        cell: ({row}) => {
            const reviewDate = row.getValue<Date | null>("reviewDate");

            return reviewDate ? new Date(reviewDate).toLocaleDateString("en-GB") : <div className={"text-gray-500"}>Not yet</div>
        }
    },
    {
        accessorKey: "room",
        header: "Phòng",
        cell: ({row}) => {
            const room = row.getValue<string | null>("room");
            return room ? room : <div className={"text-gray-500"}>Not yet</div>;
        }
    },
    {
        accessorKey: "slot",
        header: "Slot",
        size: 100,
        cell: ({row}) => {
            const slot = row.getValue<number | null>("slot");
            return slot ? slot : <div className={"text-gray-500"}>Not yet</div>;
        }
    },
    {
        id:"status",
        header: "Trạng thái",
        size: 150,
        accessorFn: (row) => {
            return row.reviewDate && row.room && row.slot ? "Assigned" : "Not yet";
        },
        cell: ({row}) => {
            const reviewDate = row.getValue<Date | null>("reviewDate");
            const room = row.getValue<string | null>("room");
            const slot = row.getValue<number | null>("slot");

            return (reviewDate && room && slot ) ? (<Button className={"px-4 bg-green-600"}>Đã có</Button>) : (<Button variant={"destructive"}>Chưa có</Button>)
        }
    },
    {
        id: "actions",
        header: "Thao tác",
        cell: ({row}) => {
            return (
                <ActionCell row={row} />
            )
        }
    },
]
