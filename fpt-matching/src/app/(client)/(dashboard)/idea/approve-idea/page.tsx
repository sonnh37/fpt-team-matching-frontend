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
import IdeaRequestApprovedByCouncilTable from "@/components/sites/idea/approval/council/approved";
import { IdeaRequestPendingByCouncilTable } from "@/components/sites/idea/approval/council/pending";
import IdeaRequestRejectedByCouncilTable from "@/components/sites/idea/approval/council/rejected";
import IdeaRequestApprovedByMentorTable from "@/components/sites/idea/approval/mentor/approved";
import { IdeaRequestPendingByMentorTable } from "@/components/sites/idea/approval/mentor/pending";
import IdeaRequestRejectedByMentorTable from "@/components/sites/idea/approval/mentor/rejected";

export default function IdeaApprovalPage() {
  const role = useCurrentRole();
  const isLecturer = role === "Lecturer";
  const isCouncil = role === "Council";

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLecturer ? "Duyệt Ý Tưởng - Giảng Viên" : "Duyệt Ý Tưởng - Hội Đồng"}
        </h1>
        
        {isLecturer && <MentorApprovalTabs />}
        {isCouncil && <CouncilApprovalTabs />}
      </Card>
    </div>
  );
}

function CouncilApprovalTabs() {
  const tabs = [
    { id: "pending", label: "Chờ duyệt", component: <IdeaRequestPendingByCouncilTable /> },
    { id: "approved", label: "Đã duyệt", component: <IdeaRequestApprovedByCouncilTable /> },
    { id: "rejected", label: "Từ chối", component: <IdeaRequestRejectedByCouncilTable /> },
  ];

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
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
    { id: "pending", label: "Chờ duyệt", component: <IdeaRequestPendingByMentorTable /> },
    { id: "approved", label: "Đã duyệt", component: <IdeaRequestApprovedByMentorTable /> },
    { id: "rejected", label: "Từ chối", component: <IdeaRequestRejectedByMentorTable /> },
  ];

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
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