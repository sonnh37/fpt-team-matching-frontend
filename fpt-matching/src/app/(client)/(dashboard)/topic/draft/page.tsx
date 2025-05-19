"use client";
import { TopicDraftTable } from "@/components/sites/topic/draft";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="container space-y-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bản nháp chủ đề</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý các bản nháp chủ đề chưa xuất bản
        </p>
      </div>
      <Separator />
      <div className="overflow-hidden">
        <TopicDraftTable />
      </div>
    </div>
  );
}
