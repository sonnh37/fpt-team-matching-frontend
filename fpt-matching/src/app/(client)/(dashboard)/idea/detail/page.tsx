"use client";

import { IdeaUpdateForm } from "@/components/sites/idea/detail/update";
import { useSearchParams} from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();
    const ideaId = searchParams.get("ideaId");
    return <IdeaUpdateForm ideaId={ideaId as string} />;
}
