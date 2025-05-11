'use client'
import {ReviewManagement} from "@/components/sites/management/review/review-management";
import { useSearchParams} from "next/navigation";

const Page = () => {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    return projectId && <ReviewManagement projectId={projectId} />
};

export default Page;