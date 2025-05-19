"use client"
import React from 'react';
import {useSearchParams} from "next/navigation";
import UpdateTopic from "@/components/sites/management/update-idea/update-idea";

const Page = () => {
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topicId");
    return topicId && <UpdateTopic topicId={topicId} />
};

export default Page;