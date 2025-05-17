"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import InvitationReceiveByTeamTable from "./by-team";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function InivitationReceive() {
  const tabs = {
    joinTeam: "Tham gia nhóm",
    // studentRequests: "Yêu cầu từ SV"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu nhận được</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={tabs.joinTeam}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger 
              value={tabs.joinTeam}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {tabs.joinTeam}
            </TabsTrigger>
            {/* <TabsTrigger 
              value={tabs.studentRequests}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {tabs.studentRequests}
            </TabsTrigger> */}
          </TabsList>
          
          <TabsContent value={tabs.joinTeam}>
            <InvitationReceiveByTeamTable />
          </TabsContent>
          
          {/* <TabsContent value={tabs.studentRequests}>
            <InvitationReceiveToGetTopicByStudentTable />
          </TabsContent> */}
        </Tabs>
      </CardContent>
    </Card>
  );
}