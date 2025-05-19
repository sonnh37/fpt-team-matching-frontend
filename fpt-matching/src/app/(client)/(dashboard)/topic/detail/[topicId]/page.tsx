"use client";

import { TopicDetailForm } from "@/components/sites/topic/detail/update";
import { useParams } from "next/navigation";

export default function Page() {
  const { topicId } = useParams();

  return <TopicDetailForm topicId={topicId as string} />;
}
