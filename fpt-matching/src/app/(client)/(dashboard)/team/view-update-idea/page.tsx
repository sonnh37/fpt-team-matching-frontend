'use client'
import { useSearchParams } from 'next/navigation';
import React from 'react';
import UpdateIdea from "@/components/sites/management/update-idea/update-idea";

const Page = () => {
    const searchParams = useSearchParams();
    const ideaId = searchParams.get("ideaId");
    return ideaId && <UpdateIdea ideaId={ideaId} />
};

export default Page;