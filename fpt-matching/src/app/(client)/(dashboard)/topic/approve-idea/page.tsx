"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { Card } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import TopicVersionRequestApprovedByCouncilTable from "@/components/sites/topic/approval/council/approved";
import { TopicVersionRequestPendingByCouncilTable } from "@/components/sites/topic/approval/council/pending";
import TopicVersionRequestRejectedByCouncilTable from "@/components/sites/topic/approval/council/rejected";
import TopicVersionRequestApprovedByMentorTable from "@/components/sites/topic/approval/mentor/approved";
import { TopicPendingByMentorTable } from "@/components/sites/topic/approval/mentor/pending";
import TopicVersionRequestRejectedByMentorTable from "@/components/sites/topic/approval/mentor/rejected";
// import { TopicVersionRequestConsiderByCouncilTable } from "@/components/sites/topic/requests/consider-by-council";
import TopicConsiderByMentorTable from "@/components/sites/topic/approval/mentor/consider";

export default function TopicApprovalPage() {
  const role = useCurrentRole();
  const isLecturer = role === "Lecturer";
  const isCouncil = role === "Council";

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLecturer ? "Duyệt đề tài - Giảng Viên" : "Duyệt đề tài - Hội Đồng"}
        </h1>
        
        {isLecturer && <MentorApprovalTabs />}
        {isCouncil && <CouncilApprovalTabs />}
      </Card>
    </div>
  );
}

function CouncilApprovalTabs() {
  const tabs = [
    { id: "pending", label: "Chờ duyệt", component: <TopicVersionRequestPendingByCouncilTable /> },
    // { id: "consider", label: "Yêu cầu chỉnh sửa", component: <TopicVersionRequestConsiderByCouncilTable /> },
    { id: "approved", label: "Đã duyệt", component: <TopicVersionRequestApprovedByCouncilTable /> },
    { id: "rejected", label: "Từ chối", component: <TopicVersionRequestRejectedByCouncilTable /> },
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

function MentorApprovalTabs() {
  const tabs = [
    { id: "pending", label: "Chờ duyệt", component: <TopicPendingByMentorTable /> },
    { id: "consider", label: "Yêu cầu chỉnh sửa", component: <TopicConsiderByMentorTable /> },
    { id: "approved", label: "Đã duyệt", component: <TopicVersionRequestApprovedByMentorTable /> },
    { id: "rejected", label: "Từ chối", component: <TopicVersionRequestRejectedByMentorTable /> },
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