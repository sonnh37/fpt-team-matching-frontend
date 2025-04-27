"use client";

import { IdeaUpdateForm } from "@/components/sites/idea/detail/update";
import { useParams } from "next/navigation";

export default function Page() {
  const { ideaId } = useParams();

  return <IdeaUpdateForm ideaId={ideaId as string} />;
}
