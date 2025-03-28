"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import InvitationSentByStudentTable from "./by-me";
import InvitationSentForIdeaTable from "./for-idea";

export function InivitationSent() {
  const tab_1 = "By me";
  const tab_2 = "For idea from lecturer";
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
          <InvitationSentForIdeaTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
