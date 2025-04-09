'use client'
import React from 'react';
import {useSearchParams} from "next/navigation";
import DefenseDetailsComponent from "@/components/sites/management/defense-details/defense-details-component";

const Page = () => {
    const searchParams = useSearchParams();
    const capstoneScheduleId = searchParams.get("defenseId")
    if (!capstoneScheduleId) {
        return (
            <div className={"font-bold w-full h-screen text-red-500 flex justify-center items-center"}>
                Defense không tồn tại
            </div>
        )
    }
    return (
        <DefenseDetailsComponent capstoneScheduleId={capstoneScheduleId} />
    );
};

export default Page;