"use client";

import { TopicRequestAllManagerTable } from "@/components/sites/management/topic-requests";
import { TopicRequestApprovedManagerTable } from "@/components/sites/management/topic-requests/approved";
import { TopicRequestPendingManagerTable } from "@/components/sites/management/topic-requests/pending";
import { TopicRequestRejectedManagerTable } from "@/components/sites/management/topic-requests/rejected";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Quản lý yêu cầu đề tài</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Đang chờ duyệt</TabsTrigger>
          <TabsTrigger value="approved">Đã đồng ý</TabsTrigger>
          <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TopicRequestAllManagerTable />
        </TabsContent>

        <TabsContent value="pending">
          <TopicRequestPendingManagerTable />
        </TabsContent>

        <TabsContent value="approved">
          <TopicRequestApprovedManagerTable />
        </TabsContent>

        <TabsContent value="rejected">
          <TopicRequestRejectedManagerTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
