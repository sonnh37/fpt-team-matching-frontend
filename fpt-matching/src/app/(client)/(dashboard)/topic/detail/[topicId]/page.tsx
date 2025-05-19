"use client";

import { TopicUpdateForm } from "@/components/sites/topic/detail/update";
import { useParams } from "next/navigation";

export default function Page() {
  const { topicId } = useParams();

  return <TopicUpdateForm topicId={topicId as string} />;
}
