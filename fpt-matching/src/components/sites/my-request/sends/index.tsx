"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import InvitationSentByStudentTable from "./by-me";
import InvitationSentForIdeaTable from "./for-idea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function InivitationSent() {
  const tabs = {
    joinTeam: "Tham gia nhóm",
    supervisorIdea: "Ý tưởng GVHD"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu đã gửi</CardTitle>
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
            <TabsTrigger 
              value={tabs.supervisorIdea}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {tabs.supervisorIdea}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={tabs.joinTeam}>
            <InvitationSentByStudentTable />
          </TabsContent>
          
          <TabsContent value={tabs.supervisorIdea}>
            <InvitationSentForIdeaTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}