"use client";
import InvitationJoinRequestTable from "@/components/sites/my-request/join-request";
import InvitationRequestToJoinTable from "@/components/sites/my-request/request-to-join";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";

export default function Page() {
  const tab_1 = "Request to join";
  const tab_2 = "Join request";
  return (
    <>
      <Tabs defaultValue={tab_1} className="w-full container mx-auto">
        <TabsList>
          <TabsTrigger value={tab_1}>{tab_1}</TabsTrigger>
          <TabsTrigger value={tab_2}>{tab_2}</TabsTrigger>
        </TabsList>
        <TabsContent value={tab_1}>
          <InvitationRequestToJoinTable />
        </TabsContent>
        <TabsContent value={tab_2}>
          <InvitationJoinRequestTable />
        </TabsContent>
      </Tabs>
    </>
  );
}
