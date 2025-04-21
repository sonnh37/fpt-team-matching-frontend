"use client"
import React from 'react';
import {useSearchParams} from "next/navigation";
import UpdateIdea from "@/components/sites/management/update-idea/update-idea";

const Page = () => {
    const searchParams = useSearchParams();
    const ideaId = searchParams.get("ideaId");
    return ideaId && <UpdateIdea ideaId={ideaId} />
};

export default Page;