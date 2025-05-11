'use client'
import { useSearchParams } from 'next/navigation';
import React from 'react';
import {ReviewDetail} from "@/components/sites/management/review/review-detail/review-detail";

const Page = () => {
    const searchParams = useSearchParams();
    const reviewId = searchParams.get("reviewId");
    return reviewId &&
        <ReviewDetail reviewId={reviewId} />
};

export default Page;