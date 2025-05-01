"use client";
import { InivitationReceive } from "@/components/sites/my-request/receives";
import { InivitationSent } from "@/components/sites/my-request/sends";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Card } from "@/components/ui/card";

export default function Page() {
  const roleCurrent = useCurrentRole();
  if (!roleCurrent) return null;

  const tabs = {
    sent: "Yêu cầu đã gửi",
    received: "Yêu cầu nhận được"
  };

  const defaultTab = tabs.sent;

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="p-2 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Quản lý Yêu cầu</h1>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value={tabs.sent} className="data-[state=active]:bg-primary data-[state=active]:text-white">
              {tabs.sent}
            </TabsTrigger>
            <TabsTrigger value={tabs.received} className="data-[state=active]:bg-primary data-[state=active]:text-white">
              {tabs.received}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={tabs.sent}>
            <InivitationSent />
          </TabsContent>
          
          <TabsContent value={tabs.received}>
            <InivitationReceive />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}