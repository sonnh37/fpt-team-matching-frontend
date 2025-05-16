"use client";

import { TopicUpdateForm } from "@/components/sites/topic/detail/update";
import { useSearchParams} from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topicId");
    return <TopicUpdateForm topicId={topicId as string} />;
}
