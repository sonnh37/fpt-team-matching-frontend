"use client";
import { InivitationReceive } from "@/components/sites/my-request/receives";
import InvitationSendByTeamTable from "@/components/sites/my-request/receives/by-team";
import { InivitationSent } from "@/components/sites/my-request/sends";
import InvitationSentByStudentTable from "@/components/sites/my-request/sends/by-me";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";

export default function Page() {
  const tab_1 = "Send";
  const tab_2 = "Receive";
  return (
    <>
      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <TabsList>
          <TabsTrigger value={tab_1}>{tab_1}</TabsTrigger>
          <TabsTrigger value={tab_2}>{tab_2}</TabsTrigger>
        </TabsList>
        <TabsContent value={tab_1}>
          <InivitationSent />
        </TabsContent>
        <TabsContent value={tab_2}>
          <InivitationReceive />
        </TabsContent>
      </Tabs>
    </>
  );
}
