import React, {useEffect} from 'react';
import {IdeaHistory} from "@/types/idea-history";
import {IdeaHistoryStatus} from "@/types/enums/idea-history";
import {ideaHistoryService} from "@/services/idea-history-service";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {TabsContent, TabsList, TabsPriroot, TabsTrigger} from "@/components/ui/tabs";
import CollapsibleIdeaHistory from "@/components/sites/management/update-idea/collapsile-idea-history";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Textarea} from "@/components/ui/textarea";
import {UpdateIdeaDialog} from "@/components/sites/management/update-idea/update-idea-dialog";
import DocxView from "@/components/sites/management/docx-view/docx-view";
import { useCurrentRole } from '@/hooks/use-current-role';

const UpdateIdea = ({ideaId} : {ideaId: string}) => {
    const [ideaHistories, setIdeaHistoies] = React.useState<IdeaHistory[]>([]);
    const [selectedIdeaHistory, setSelectedIdeaHistory] = React.useState<IdeaHistory | null>(null);
    const [fileUrl, setFileUrl] = React.useState<string | null>(null);
    const [status, setStatus] = React.useState<IdeaHistoryStatus | null>(null);
    const [comment, setComment] = React.useState<string | null>(null);
    const [decision, setDecision] = React.useState<IdeaHistoryStatus| null>(null);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const currentRole = useCurrentRole();
    useEffect(() => {
        const fetchData = async () => {
            if (!ideaId) return

            const response = await ideaHistoryService.getAllIdeaHistoryByIdeaId(ideaId);
            if (response.data && response) {
                // const sortData = response.data.sort((a, b) => a.createdDate! - b.createdDate!);
                setIdeaHistoies(response.data);
                const selected = response.data.filter(x => x.status == IdeaHistoryStatus.Pending)[0]
                if (selected) {
                    setSelectedIdeaHistory(selected)
                } else {
                    setSelectedIdeaHistory(response.data[0])
                }
            }
        }
        fetchData();
    }, [ideaId]);
    useEffect(() => {
        if (selectedIdeaHistory && selectedIdeaHistory.fileUpdate) {
            setFileUrl(selectedIdeaHistory.fileUpdate)
            setStatus(selectedIdeaHistory.status!)
            if (selectedIdeaHistory.comment) {
                setComment(selectedIdeaHistory.comment)
            }
        }
    }, [selectedIdeaHistory]);

    return selectedIdeaHistory && (
        <div className={"w-full flex flex-row  justify-between"}>
            <div className={"w-1/5 h-[85vh] "}>
                <Card className="w-[18vw] ml-8 mt-12 h-[80vh]">
                    <CardHeader>
                        <CardTitle>Đánh giá chỉnh sửa</CardTitle>
                        <CardDescription>Vui lòng để lại nhận xét và cập nhật chỉnh sửa cho sinh viên</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TabsPriroot defaultValue="fileInfo" className="w-full]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="fileInfo">Thông tin file</TabsTrigger>
                                <TabsTrigger value="action">Đánh giá chỉnh sửa</TabsTrigger>
                            </TabsList>
                            <TabsContent className={"mt-4"} value="fileInfo">
                                <CollapsibleIdeaHistory selectedIdeaHistory={selectedIdeaHistory}
                                                        setSelectedIdeaHistory={setSelectedIdeaHistory}
                                                        ideaHis={ideaHistories}/>
                                <div className={"mt-8 flex flex-col gap-4"}>
                                    <div className={"w-full"}>
                                        <Label className={"pl-2 font-bold"}>Tên file :</Label>
                                        <Input className={"overflow-ellipsis overflow-hidden text-sm"}
                                               value={`CAPSTONE_REGISTER_${selectedIdeaHistory?.fileUpdate?.split("CAPSTONE_REGISTER_")[1]}`}/>
                                    </div>
                                    <div className={"w-full flex flex-rows items-center"}>
                                        <Label className={"pl-2 font-bold"}>Ngày tải lên: </Label>
                                        <div
                                            className={"ml-2 text-sm"}>{new Date(selectedIdeaHistory.createdDate!).toLocaleString("en-GB")}</div>
                                    </div>
                                    <div className={"w-full flex flex-rows items-center"}>
                                        <Label className={"pl-2 font-bold"}>Giai đoạn: </Label>
                                        <div className={"ml-2 text-sm"}>Review {selectedIdeaHistory.reviewStage}</div>
                                    </div>
                                    <div className={"w-full"}>
                                        <Label className={"pl-2 font-bold"}>Trạng thái: </Label>
                                        <Badge
                                            variant={"default"}
                                            className={`ml-2 p-1 ${selectedIdeaHistory.status == IdeaHistoryStatus.Pending ? "bg-amber-600" : selectedIdeaHistory.status == IdeaHistoryStatus.Approved ? "bg-green-500" : "bg-red-500"}`}
                                        >{IdeaHistoryStatus[selectedIdeaHistory.status!]}</Badge>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="action">
                                <div className={"w-full flex flex-col gap-4"}>
                                    <div>
                                        <Label className={"pl-2 font-bold"}>Nhận xét</Label>
                                        <Textarea
                                            disabled={!!(currentRole && currentRole == "Student")}
                                            value={comment || undefined} onChange={(e) => {
                                            setComment(e.target.value)
                                        }} placeholder="Type your message here."/>
                                    </div>
                                    <div className={"w-full flex flex-col gap-2"}>
                                        <Label className={"pl-2 mb-4 font-bold"}>Đánh giá cuối cùng</Label>
                                        {
                                            currentRole && currentRole == "Student" ? (
                                                <Badge
                                                    variant={"default"}
                                                    className={`text-center py-4 flex justify-center items-center ${selectedIdeaHistory.status == IdeaHistoryStatus.Pending ? "bg-amber-600" : selectedIdeaHistory.status == IdeaHistoryStatus.Approved ? "bg-green-500": "bg-red-500"} px-2`}
                                                >{IdeaHistoryStatus[selectedIdeaHistory.status!]}</Badge>
                                            ) :status
                                                ? (<Badge
                                                    variant={"default"}
                                                    className={`text-center py-4 flex justify-center items-center ${status == IdeaHistoryStatus.Approved ? "bg-green-500" : "bg-red-500"}`}
                                                >{IdeaHistoryStatus[status]}</Badge>)
                                                : selectedIdeaHistory && (
                                                <UpdateIdeaDialog isOpen={isOpen} setIsOpen={setIsOpen} comment={comment}
                                                                  decision={decision}
                                                                  setStatus={setStatus}
                                                                  ideaHistoryId={selectedIdeaHistory.id!}
                                                                  setDecision={setDecision}/>
                                            )
                                        }
                                        {/*{status*/}
                                        {/*    ? (<Badge*/}
                                        {/*        variant={"default"}*/}
                                        {/*        className={`text-center py-4 flex justify-center items-center ${status == IdeaHistoryStatus.Approved ? "bg-green-500" : "bg-red-500"}`}*/}
                                        {/*    >{IdeaHistoryStatus[status]}</Badge>)*/}
                                        {/*    : selectedIdeaHistory && (*/}
                                        {/*    <UpdateIdeaDialog isOpen={isOpen} setIsOpen={setIsOpen} comment={comment}*/}
                                        {/*                      decision={decision}*/}
                                        {/*                      setStatus={setStatus}*/}
                                        {/*                      ideaHistoryId={selectedIdeaHistory.id!}*/}
                                        {/*                      setDecision={setDecision}/>*/}
                                        {/*)*/}
                                        {/*}*/}
                                    </div>
                                </div>
                            </TabsContent>
                        </TabsPriroot>
                    </CardContent>
                </Card>
            </div>
            {fileUrl && <DocxView url={fileUrl}/>}
        </div>
    )
};

export default UpdateIdea;