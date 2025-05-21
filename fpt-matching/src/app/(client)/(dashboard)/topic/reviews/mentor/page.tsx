"use client";
import ErrorHttp from "@/components/_common/errors/error-http";
import TopicVersionRequestApprovedByMentorTable from "@/components/sites/topic/approval/mentor/approved";
import TopicConsiderByMentorTable from "@/components/sites/topic/approval/mentor/consider";
import { TopicPendingByMentorTable } from "@/components/sites/topic/approval/mentor/pending";
import TopicVersionRequestRejectedByMentorTable from "@/components/sites/topic/approval/mentor/rejected";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useCurrentRole } from "@/hooks/use-current-role";

export default function Page() {
  const role = useCurrentRole();
  const isMentor = role === "Mentor";

  if (!isMentor) return <ErrorHttp statusCode={403} />;
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Duyệt đề tài - Giảng Viên
      </h1>

      <MentorApprovalTabs />
    </div>
  );
}

function MentorApprovalTabs() {
  const tabs = [
    {
      id: "pending",
      label: "Chờ duyệt",
      component: <TopicPendingByMentorTable />,
    },
    {
      id: "consider",
      label: "Yêu cầu chỉnh sửa",
      component: <TopicConsiderByMentorTable />,
    },
    {
      id: "approved",
      label: "Đã duyệt",
      component: <TopicVersionRequestApprovedByMentorTable />,
    },
    {
      id: "rejected",
      label: "Từ chối",
      component: <TopicVersionRequestRejectedByMentorTable />,
    },
  ];

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="data-[state=active]:bg-primary data-[state=active]:text-white"
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
