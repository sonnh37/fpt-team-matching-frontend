import React from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {ImportOneCard} from "@/components/sites/management/import-user/import-one-card";
import ImportManyCard from "@/components/sites/management/import-user/import-many-card";
const ImportUser = ({role} : {role: string}) => {
    return (
        <Tabs defaultValue="one" className="p-8 w-full">
            <div className={"w-full flex justify-center items-center"}>
                <TabsList className="grid w-1/2 grid-cols-2 items-center">
                    <TabsTrigger value="one">Thêm 1 tài khoản</TabsTrigger>
                    <TabsTrigger value="many">Thêm danh sách tài khoản</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent className={"flex flex-row justify-center items-center"} value="one">
                <ImportOneCard role={role} />
            </TabsContent>
            <TabsContent value="many">
               <ImportManyCard role={role} />
            </TabsContent>
        </Tabs>
    )
};

export default ImportUser;