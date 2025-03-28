"use client";
import InvitationSentByStudentTable from "@/components/sites/my-request/sent-by-student";
import InvitationSendByTeamTable from "@/components/sites/my-request/send-by-team";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";

export default function Page() {
  const tab_1 = "Send By me";
  const tab_2 = "Receive By team";
  return (
    <>
      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <TabsList>
          <TabsTrigger value={tab_1}>{tab_1}</TabsTrigger>
          <TabsTrigger value={tab_2}>{tab_2}</TabsTrigger>
        </TabsList>
        <TabsContent value={tab_1}>
          <InvitationSentByStudentTable />
        </TabsContent>
        <TabsContent value={tab_2}>
          <InvitationSendByTeamTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
