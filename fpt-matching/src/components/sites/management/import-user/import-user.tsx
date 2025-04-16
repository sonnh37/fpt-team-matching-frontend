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
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="current">Current password</Label>
                            <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="new">New password</Label>
                            <Input id="new" type="password" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save password</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
};

export default ImportUser;