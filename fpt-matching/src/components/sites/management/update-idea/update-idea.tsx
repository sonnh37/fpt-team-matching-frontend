import React, {useEffect} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import CollapsibleTopicHistory from "@/components/sites/management/update-idea/collapsile-idea-history";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Textarea} from "@/components/ui/textarea";
import {UpdateTopicDialog} from "@/components/sites/management/update-idea/update-idea-dialog";
import DocxView from "@/components/sites/management/docx-view/docx-view";
import {useCurrentRole} from '@/hooks/use-current-role';
import {TopicVersion} from "@/types/topic-version";
import {TopicVersionStatus} from "@/types/enums/topic-version";
import {topicVersionService} from '@/services/topic-version-service';
import {TopicVersionRequestStatus} from "@/types/enums/topic-version-request";

const UpdateTopic = ({topicId} : {topicId: string}) => {
    const [topicVersion, setTopicVersion] = React.useState<TopicVersion[]>([]);
    const [selectedTopicHistory, setSelectedTopicHistory] = React.useState<TopicVersion | null>(null);
    const [fileUrl, setFileUrl] = React.useState<string | null>(null);
    const [mentorStatus, setMentorStatus] = React.useState<TopicVersionRequestStatus | null>(null);
    const [managerStatus, setManagerStatus] = React.useState<TopicVersionRequestStatus | null>(null);
    const [mentorComment, setMentorComment] = React.useState<string | null>(null);
    const [managerComment, setManagerComment] = React.useState<string | null>(null);
    const [decision, setDecision] = React.useState<TopicVersionRequestStatus| null>(null);
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    const currentRole = useCurrentRole();
    useEffect(() => {
        const fetchData = async () => {
            if (!topicId) return

            const response = await topicVersionService.getByTopicId(topicId);
            if (response.data && response) {
                // const sortData = response.data.sort((a, b) => a.createdDate! - b.createdDate!);
                setTopicVersion(response.data);
                const selected = response.data.filter(x => x.status == TopicVersionStatus.Pending)[0]
                if (selected) {
                    setSelectedTopicHistory(selected)
                } else {
                    setSelectedTopicHistory(response.data[0])
                }
            }
        }
        fetchData();
    }, [topicId]);
    useEffect(() => {
        if (selectedTopicHistory && selectedTopicHistory.fileUpdate) {
            setFileUrl(selectedTopicHistory.fileUpdate)
            selectedTopicHistory.topicVersionRequests.forEach(x => {
                if (x.role == "Mentor"){
                    setMentorStatus(x.status!)
                    setMentorComment(x.feedback ?? null)
                }
                if (x.role == "Manager"){
                    setManagerStatus(x.status!)
                    setManagerComment(x.feedback ?? null)
                }
            })
            // selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Mentor") ? setMentorStatus(selectedTopicHistory.topicVersionRequests[0].status ?? TopicVersionRequestStatus.Pending)
            // if (selectedTopicHistory.comment) {
            //     setComment(selectedTopicHistory.comment)
            // }
        }
    }, [selectedTopicHistory]);
    console.log(selectedTopicHistory)
    // console.log(managerComment)
    // console.log(mentorComment)
    return selectedTopicHistory ? (
        <div className={"w-full flex flex-row  justify-between"}>
            <div className={"w-1/5 h-[85vh] "}>
                <Card className="w-[18vw] ml-8 mt-12 h-[80vh] overflow-auto">
                    <CardHeader>
                        <CardTitle>Đánh giá chỉnh sửa</CardTitle>
                        <CardDescription>Vui lòng để lại nhận xét và cập nhật chỉnh sửa cho sinh viên</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="fileInfo" className="w-full]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="fileInfo">Thông tin file</TabsTrigger>
                                <TabsTrigger value="action">Đánh giá chỉnh sửa</TabsTrigger>
                            </TabsList>
                            <TabsContent className={"mt-4"} value="fileInfo">
                                <CollapsibleTopicHistory selectedTopicHistory={selectedTopicHistory}
                                                        setSelectedTopicHistory={setSelectedTopicHistory}
                                                        topicHis={topicVersion}/>
                                <div className={"mt-8 flex flex-col gap-4"}>
                                    <div className={"w-full"}>
                                        <Label className={"pl-2 font-bold"}>Tên file :</Label>
                                        <Input className={"overflow-ellipsis overflow-hidden text-sm"}
                                               value={`CAPSTONE_REGISTER_${selectedTopicHistory?.fileUpdate?.split("CAPSTONE_REGISTER_")[1]}`}/>
                                    </div>
                                    <div className={"w-full flex flex-rows items-center"}>
                                        <Label className={"pl-2 font-bold"}>Ngày tải lên: </Label>
                                        <div
                                            className={"ml-2 text-sm"}>{new Date(selectedTopicHistory.createdDate!).toLocaleString("en-GB")}</div>
                                    </div>
                                    <div className={"w-full flex flex-rows items-center"}>
                                        <Label className={"pl-2 font-bold"}>Giai đoạn: </Label>
                                        <div className={"ml-2 text-sm"}>Review {selectedTopicHistory.reviewStage}</div>
                                    </div>
                                    <div className={"w-full"}>
                                        <Label className={"pl-2 font-bold"}>Trạng thái: </Label>
                                        <Badge
                                            variant={"default"}
                                            className={`ml-2 p-1 ${selectedTopicHistory.status == TopicVersionStatus.Pending ? "bg-amber-600" : selectedTopicHistory.status == TopicVersionStatus.Approved ? "bg-green-500" : "bg-red-500"}`}
                                        >{TopicVersionStatus[selectedTopicHistory.status!]}</Badge>
                                    </div>
                                    <div className={"w-full flex flex-rows items-center"}>
                                        <Label className={"pl-2 font-bold mr-2"}>Note: </Label>
                                        <Textarea value={selectedTopicHistory.note} />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="action">
                                <div className={"w-full flex flex-col gap-4"}>
                                    <div className={"w-full flex flex-col gap-4"}>
                                        <div>
                                            <Label className={"pl-2 font-bold"}>Nhận xét của mentor</Label>
                                            <Textarea
                                                disabled={!!(currentRole && (currentRole == "Student" || currentRole == "Manager"))}
                                                value={mentorComment || undefined} onChange={(e) => {
                                                setMentorComment(e.target.value)
                                            }} placeholder="Type your message here."/>
                                        </div>
                                        <div className={"w-full flex flex-col gap-2"}>
                                            <Label className={"pl-2 mb-4 font-bold"}>Đánh giá của mentor</Label>
                                            {
                                                currentRole && (currentRole == "Student" || currentRole == "Manager") ? (
                                                    <Badge
                                                        variant={"default"}
                                                        className={`text-center py-4 flex justify-center items-center ${selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Mentor")[0].status == TopicVersionRequestStatus.Pending ?
                                                            "bg-amber-600" :
                                                            selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Mentor")[0].status == TopicVersionRequestStatus.Approved ?
                                                                "bg-green-500": "bg-red-500"} px-2`}
                                                    >{TopicVersionStatus[selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Mentor")[0].status!]}</Badge>
                                                ) : mentorStatus
                                                    ? (<Badge
                                                        variant={"default"}
                                                        className={`text-center py-4 flex justify-center items-center ${mentorStatus == TopicVersionRequestStatus.Approved ? "bg-green-500" : "bg-red-500"}`}
                                                    >{TopicVersionStatus[mentorStatus]}</Badge>)
                                                    : selectedTopicHistory && (
                                                    <UpdateTopicDialog isOpen={isOpen} setIsOpen={setIsOpen} comment={mentorComment}
                                                                      decision={decision}
                                                                      setStatus={setMentorStatus}
                                                                      topicHistoryId={selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Mentor")[0].id!}
                                                                      setDecision={setDecision}/>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className={"w-full h-[1px] bg-gray-500 my-8"}></div>

                                    <div className={"w-full flex flex-col gap-4"}>
                                        <div>
                                            <Label className={"pl-2 font-bold"}>Nhận xét của manager</Label>
                                            <Textarea
                                                disabled={!!(currentRole && (currentRole == "Student" || currentRole == "Mentor"))}
                                                value={managerComment || undefined} onChange={(e) => {
                                                setManagerComment(e.target.value)
                                            }} placeholder="Type your message here."/>
                                        </div>
                                        <div className={"w-full flex flex-col gap-2"}>
                                            <Label className={"pl-2 mb-4 font-bold"}>Đánh giá của manager</Label>
                                            {
                                                currentRole && (currentRole == "Student" || currentRole == "Mentor") ? (
                                                    <Badge
                                                        variant={"default"}
                                                        className={`text-center py-4 flex justify-center items-center ${
                                                            selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Manager")[0] == null ? 
                                                               "bg-purple-500" :
                                                            selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Manager")[0].status == TopicVersionRequestStatus.Pending ?
                                                            "bg-amber-600" :
                                                            selectedTopicHistory.status == TopicVersionStatus.Approved ?
                                                                "bg-green-500": "bg-red-500"} px-2`}
                                                    >{selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Manager")[0] == null ? "Chưa được gửi" : TopicVersionStatus[selectedTopicHistory.status!]}</Badge>
                                                ) : managerStatus
                                                    ? (<Badge
                                                        variant={"default"}
                                                        className={`text-center py-4 flex justify-center items-center ${managerStatus == TopicVersionRequestStatus.Approved ? "bg-green-500" : "bg-red-500"}`}
                                                    >{TopicVersionStatus[managerStatus]}</Badge>)
                                                    : selectedTopicHistory && (
                                                    <UpdateTopicDialog isOpen={isOpen} setIsOpen={setIsOpen} comment={managerComment}
                                                                      decision={decision}
                                                                      setStatus={setManagerStatus}
                                                                      topicHistoryId={selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Manager")[0] != null ? selectedTopicHistory.topicVersionRequests.filter(x => x.role == "Manager")[0].id! : ""}
                                                                      setDecision={setDecision}/>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
            {fileUrl && <DocxView url={fileUrl}/>}
        </div>
    ) : <div className={"font-bold text-lg w-full flex justify-center items-center"}>Không có cập nhật từ sinh viên</div>
};

export default UpdateTopic;