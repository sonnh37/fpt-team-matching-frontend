"use client";
import ErrorHttp from "@/components/_common/errors/error-http";
import TopicApprovedBySubMentorTable from "@/components/sites/topic/approval/submentor/approved";
import TopicConsiderBySubMentorTable from "@/components/sites/topic/approval/submentor/consider";
import { TopicPendingBySubMentorTable } from "@/components/sites/topic/approval/submentor/pending";
import TopicRejectedBySubMentorTable from "@/components/sites/topic/approval/submentor/rejected";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useCurrentRole } from "@/hooks/use-current-role";

export default function Page() {
  const role = useCurrentRole();
  const isSubMentor = role === "Mentor";

  if (!isSubMentor) return <ErrorHttp statusCode={403} />;
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Duyệt đề tài - Giảng Viên 2
      </h1>

      <SubMentorApprovalTabs />
    </div>
  );
}

function SubMentorApprovalTabs() {
  const tabs = [
    {
      id: "pending",
      label: "Chờ duyệt",
      component: <TopicPendingBySubMentorTable />,
    },
    {
      id: "approved",
      label: "Đã duyệt",
      component: <TopicApprovedBySubMentorTable />,
    },
    {
      id: "rejected",
      label: "Từ chối",
      component: <TopicRejectedBySubMentorTable />,
    },
  ];

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
          >
            {tab.label}
            {/* Uncomment when you have counts */}
            {/* <Badge variant="outline" className="ml-2">
              {count}
            </Badge> */}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
