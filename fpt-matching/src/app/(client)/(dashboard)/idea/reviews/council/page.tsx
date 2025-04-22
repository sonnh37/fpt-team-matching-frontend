"use client";
import ErrorHttp from "@/components/_common/errors/error-http";
import IdeaVersionRequestApprovedByCouncilTable from "@/components/sites/idea/approval/council/approved";
import IdeaVersionRequestConsiderByCouncilTable from "@/components/sites/idea/approval/council/consider";
import { IdeaVersionRequestPendingByCouncilTable } from "@/components/sites/idea/approval/council/pending";
import IdeaVersionRequestRejectedByCouncilTable from "@/components/sites/idea/approval/council/rejected";
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
  const isCouncil = role === "Council";

  if (!isCouncil) return <ErrorHttp statusCode={403} />;
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Duyệt đề tài - Hội đồng
      </h1>

      <CouncilApprovalTabs />
    </div>
  );
}

function CouncilApprovalTabs() {
  const tabs = [
    {
      id: "pending",
      label: "Chờ duyệt",
      component: <IdeaVersionRequestPendingByCouncilTable />,
    },
    {
      id: "consider",
      label: "Yêu cầu chỉnh sửa",
      component: <IdeaVersionRequestConsiderByCouncilTable />,
    },
    {
      id: "approved",
      label: "Đã duyệt",
      component: <IdeaVersionRequestApprovedByCouncilTable />,
    },
    {
      id: "rejected",
      label: "Từ chối",
      component: <IdeaVersionRequestRejectedByCouncilTable />,
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
