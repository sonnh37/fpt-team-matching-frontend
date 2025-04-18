import React from 'react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import SystemNotiCard from "@/components/sites/management/notifications/system-noti-card";
import RoleBasedNotiCard from "@/components/sites/management/notifications/role-based-noti-card";
import TeamBasedNotiCard from "@/components/sites/management/notifications/team-based-noti-card";
import InvidualNotiCard from "@/components/sites/management/notifications/invidual-noti-card";

function NotificationImport() {
    return (
        <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="system">Tạo thông báo toàn hệ thống</TabsTrigger>
                <TabsTrigger value="role-based">Tạo thông báo theo vai trò</TabsTrigger>
                <TabsTrigger value="team-based">Tạo thông báo theo nhóm</TabsTrigger>
                <TabsTrigger value="invidual">Tạo thông báo tới cá nhân</TabsTrigger>
            </TabsList>
            <TabsContent value="system">
                <SystemNotiCard />
            </TabsContent>
            <TabsContent value="role-based">
                <RoleBasedNotiCard />
            </TabsContent>
            <TabsContent value="team-based">
                <TeamBasedNotiCard />
            </TabsContent>
            <TabsContent value="invidual">
                <InvidualNotiCard />
            </TabsContent>
        </Tabs>
    )
}


export default NotificationImport;