"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Review} from "@/types/review";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

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
        size: 300
    },
    {
        accessorKey: "project.idea.englishName",
        id: "englishName",
        header: "English/Japanese name",
        size: 300
    },
    {
        accessorKey: "reviewDate",
        header: "Review Date",
        cell: ({row}) => {
            const reviewDate = row.getValue<Date | null>("reviewDate");

            return reviewDate ? reviewDate : <div className={"text-gray-500"}>Not yet</div>
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
        cell: ({row}) => {
            const slot = row.getValue<number | null>("slot");
            return slot ? slot : <div className={"text-gray-500"}>Not yet</div>;
        }
    },
    {
        id:"status",
        header: "Status",
        cell: ({row}) => {
            const reviewDate = row.getValue<Date | null>("reviewDate");
            const room = row.getValue<string | null>("room");
            const slot = row.getValue<number | null>("slot");

            return (reviewDate && room && slot ) ? (<Button className={"px-4 bg-green-600"}>Assigned</Button>) : (<Button variant={"destructive"}>Not yet</Button>)
        }
    },
    // {
    //     accessorKey: "reviewer1",
    //     header: "Reviewer 1",
    // },
]
