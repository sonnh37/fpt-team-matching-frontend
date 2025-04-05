"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import InvitationSentByStudentTable from "./by-me";
import InvitationSentForIdeaTable from "./for-idea";
import { useCurrentRole } from "@/hooks/use-current-role";

export function InivitationSent() {
  const roleCurrent = useCurrentRole();
  if (roleCurrent == null) return;
  const tab_1 = "Join team";
  const tab_2 = "Supervisor's Idea";

  return (
    <>
      <Tabs defaultValue={tab_1} className="w-full">
        <TabsList>
          <TabsTrigger value={tab_1}>{tab_1}</TabsTrigger>
          <TabsTrigger value={tab_2}>{tab_2}</TabsTrigger>
        </TabsList>
        <TabsContent value={tab_1}>
          <InvitationSentByStudentTable />
        </TabsContent>
        <TabsContent value={tab_2}>
          <InvitationSentForIdeaTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
