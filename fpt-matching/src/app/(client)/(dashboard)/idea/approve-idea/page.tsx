"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import IdeaVersionRequestApprovedByCouncilTable from "@/components/sites/idea/approval/council/approved";
import { IdeaVersionRequestPendingByCouncilTable } from "@/components/sites/idea/approval/council/pending";
import IdeaVersionRequestRejectedByCouncilTable from "@/components/sites/idea/approval/council/rejected";
import IdeaVersionRequestApprovedByMentorTable from "@/components/sites/idea/approval/mentor/approved";
import { IdeaVersionRequestPendingByMentorTable } from "@/components/sites/idea/approval/mentor/pending";
import IdeaVersionRequestRejectedByMentorTable from "@/components/sites/idea/approval/mentor/rejected";
import { IdeaVersionRequestConsiderByCouncilTable } from "@/components/sites/idea/requests/consider-by-council";
import IdeaVersionRequestConsiderByMentorTable from "@/components/sites/idea/approval/mentor/consider";

export default function IdeaApprovalPage() {
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
    { id: "pending", label: "Chờ duyệt", component: <IdeaVersionRequestPendingByCouncilTable /> },
    { id: "consider", label: "Yêu cầu chỉnh sửa", component: <IdeaVersionRequestConsiderByCouncilTable /> },
    { id: "approved", label: "Đã duyệt", component: <IdeaVersionRequestApprovedByCouncilTable /> },
    { id: "rejected", label: "Từ chối", component: <IdeaVersionRequestRejectedByCouncilTable /> },
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
    { id: "pending", label: "Chờ duyệt", component: <IdeaVersionRequestPendingByMentorTable /> },
    { id: "consider", label: "Yêu cầu chỉnh sửa", component: <IdeaVersionRequestConsiderByMentorTable /> },
    { id: "approved", label: "Đã duyệt", component: <IdeaVersionRequestApprovedByMentorTable /> },
    { id: "rejected", label: "Từ chối", component: <IdeaVersionRequestRejectedByMentorTable /> },
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