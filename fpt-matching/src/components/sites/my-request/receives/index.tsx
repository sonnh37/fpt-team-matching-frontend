"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import InvitationReceiveByTeamTable from "./by-team";
import InvitationReceiveToGetIdeaByStudentTable from "./request-idea-by-student";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole } from "@/hooks/use-current-role";

export function InivitationReceive() {
  const roleCurrent = useCurrentRole();

  const tab_1 = "By team";
  const tab_2 = "Request Idea By Student (Role: Mentor)";
  return (
    <>
      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <TabsList>
          <TabsTrigger value={tab_1}>{tab_1}</TabsTrigger>
          {roleCurrent === "Lecturer" && (
            <TabsTrigger value={tab_2}>{tab_2}</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value={tab_1}>
          <InvitationReceiveByTeamTable />
        </TabsContent>
        <TabsContent value={tab_2}>
          <InvitationReceiveToGetIdeaByStudentTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
