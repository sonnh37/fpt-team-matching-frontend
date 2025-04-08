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
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                        router.push("manage-review/review-details?reviewId="+review.id)
                    }}>View review details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
};
export const ReviewColumns: ColumnDef<Review>[] = [
    {
        accessorKey: "number",
        header: "Review number",
        size: 100
    },
    {
        accessorKey: "project.teamCode",
        id: "teamCode",
        header: "Team Code",
        size: 150
    },
    {
        accessorKey: "project.idea.ideaCode",
        id: "ideaCode",
        header: "Idea Code",
        size: 150
    },
    {
        accessorKey: "project.idea.vietNamName",
        id: "vietnameseName",
        header: "Vietnamese",
        size: 250
    },
    {
        accessorKey: "project.idea.englishName",
        id: "englishName",
        header: "English/Japanese name",
        size: 250
    },
    {
        accessorKey: "reviewDate",
        header: "Review Date",
        cell: ({row}) => {
            const reviewDate = row.getValue<Date | null>("reviewDate");

            return reviewDate ? new Date(reviewDate).toLocaleDateString("en-GB") : <div className={"text-gray-500"}>Not yet</div>
        }
    },
    {
        accessorKey: "room",
        header: "Room",
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
        header: "Status",
        size: 150,
        accessorFn: (row) => {
            return row.reviewDate && row.room && row.slot ? "Assigned" : "Not yet";
        },
        cell: ({row}) => {
            const reviewDate = row.getValue<Date | null>("reviewDate");
            const room = row.getValue<string | null>("room");
            const slot = row.getValue<number | null>("slot");

            return (reviewDate && room && slot ) ? (<Button className={"px-4 bg-green-600"}>Assigned</Button>) : (<Button variant={"destructive"}>Not yet</Button>)
        }
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
