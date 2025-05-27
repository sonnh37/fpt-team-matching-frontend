"use client"; // Đánh dấu component là Client Component

import { CreateProjectForm } from "@/components/sites/topic/create";
import { TopicDraftTable } from "@/components/sites/topic/draft";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("create");

  // Lấy giá trị tab từ URL khi component mount
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "drafts") {
      setActiveTab("drafts");
    } else {
      setActiveTab("create");
    }
  }, [searchParams]);

  // Xử lý khi tab thay đổi
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Cập nhật URL mà không reload trang
    router.replace(`/topic/create?tab=${value}`, { scroll: false });
  };

  return (
    <div className="container mx-auto py-8">
      {/* <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="create">Tạo đề tài</TabsTrigger>
          <TabsTrigger value="drafts">Bản nháp</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="mt-6">
            <CreateProjectForm />
          </div>
        </TabsContent>

        <TabsContent value="drafts">
          <div className="mt-6">
            <TopicDraftTable />
          </div>
        </TabsContent>
      </Tabs>
       */}

       <CreateProjectForm />
    </div>
  );
}