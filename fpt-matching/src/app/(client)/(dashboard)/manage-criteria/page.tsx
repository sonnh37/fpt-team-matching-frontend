"use client";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs-shadcn";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import { criteriaFormService } from "@/services/criteria-form-service";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import CriteriaFormTable from "@/components/_common/criteria-form/criteria-form";
import Criteria from "@/components/_common/criteria/criteria";
import CriteriaAnswerManagement from "@/components/_common/criteria-answer/criteria-answer";


export default function Page() {
    const roleCurrent = useCurrentRole();
    if (!roleCurrent) return null;

    const tabs = {
        form: "Quản lí các đơn",
        criteria: "Quản lí các tiêu chí",
        answer: "Quản lí các kết quả của form"

    };

    const defaultTab = roleCurrent === "Lecturer" ? tabs.criteria : tabs.form;




    return (
        <div className="container mx-auto px-4 py-6">
            <Card className="p-2 md:p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Quản lý Các Tiêu Chí Trong Đơn</h1>

                <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full max-w-screen-lg mx-auto mb-6">
                        <TabsTrigger value={tabs.form} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                            {tabs.form}
                        </TabsTrigger>
                        <TabsTrigger value={tabs.criteria} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                            {tabs.criteria}
                        </TabsTrigger>
                        <TabsTrigger value={tabs.answer} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                            {tabs.answer}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={tabs.form}>
                        <CriteriaFormTable />
                    </TabsContent>
                    <TabsContent value={tabs.criteria}>
                        <Criteria />
                    </TabsContent>
                    <TabsContent value={tabs.answer}>
                        <CriteriaAnswerManagement />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}