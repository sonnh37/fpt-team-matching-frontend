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
import { useCurrentRole } from "@/hooks/use-current-role";

export default function Page() {
  const roleCurrent = useCurrentRole();
  if (roleCurrent == null) return;
  const tab_1 = "Send request";
  const tab_2 = "Receive request";
  const defaultTab = roleCurrent == "Lecturer" ? tab_2 : tab_1;

  console.log("check_defaulttabv", defaultTab);
  return (
    <>
      <Tabs defaultValue={defaultTab} className="w-full p-4">
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
