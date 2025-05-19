"use client";

import { TopicDetailForm } from "@/components/sites/topic/detail/update";
import { useSearchParams} from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topicId");
    return <TopicDetailForm topicId={topicId as string} />;
}
