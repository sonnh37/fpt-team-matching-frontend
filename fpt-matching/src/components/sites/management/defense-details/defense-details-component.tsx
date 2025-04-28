import React, {useEffect, useState} from 'react';
import {capstoneService} from "@/services/capstone-service";
import { CapstoneSchedule } from '@/types/capstone-schedule';
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {semesterService} from "@/services/semester-service";
import {Semester} from "@/types/semester";
import { useCurrentRole } from '@/hooks/use-current-role';
import BreadcumbCapstoneDetails from "@/components/sites/management/defense-details/breadcumb-capstone-details";
import { Label } from '@/components/ui/label';
import {Input} from "@/components/ui/input";
import DefenseTeamMembersTable from "@/components/sites/management/defense-details/defense-team-members-table";

const DefenseDetailsComponent = ({capstoneScheduleId} : {capstoneScheduleId: string}) => {
    const [capstoneSchedule, setCapstoneSchedule] = useState<CapstoneSchedule | null>();
    const [semester, setSemester] = useState<Semester | null>(null)
    useEffect(() => {
        if (capstoneScheduleId) {
            const fetchCapstoneSchedule = async () => {
                const response = await capstoneService.getById(capstoneScheduleId);
                if (response && response.data) {
                    setCapstoneSchedule(response.data);
                }
            }
            fetchCapstoneSchedule();
        }
    }, [capstoneScheduleId])

    useEffect(() => {
        const fetchCurrentSemester = async () => {
            const result = await semesterService.getCurrentSemester();
            if (result.status == 1 && result.data) {
                setSemester(result.data)
            }
        }

        fetchCurrentSemester()
    }, []);
    const currentRole = useCurrentRole();

    return (
        <div>
            <div className={"px-8 mt-4"}>
                {
                    capstoneSchedule && semester && currentRole ? (
                        <div className={""}>
                            <BreadcumbCapstoneDetails
                                semesterName={semester!.semesterName!}
                                ideaCode={capstoneSchedule!.project?.topic?.topicCode!}
                                projectCode={capstoneSchedule.project!.teamCode!}
                                stage={capstoneSchedule.stage ?? 0}
                            />
                            <div className={"font-bold text-xl mt-6"}>
                                <div>
                                    {capstoneSchedule.project?.topic?.ideaVersion?.englishName}
                                </div>
                                {/*<div>*/}
                                {/*    <Button variant={"default"}>Chỉnh sửa đề tài</Button>*/}
                                {/*</div>*/}
                            </div>
                            <div className={"w-full"}>
                                <Card className="w-full mt-4">
                                    <CardContent>
                                        <Accordion type="single" collapsible className="w-full">
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger className={"font-bold text-lg"}>
                                                    Thông tin nhóm
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className={"flex flex-col gap-1.5 font-bold"}>
                                                        <div>Tên nhóm: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.teamName}</span></div>
                                                        <div>Mã nhóm: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.teamCode}</span></div>
                                                        <div>Số lượng thành viên: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.teamSize}</span></div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-2">
                                                <AccordionTrigger className={"font-bold text-lg"}>
                                                    Thông tin đề tài
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className={"flex flex-col gap-1.5 font-bold"}>
                                                        <div>Mã đề tài: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.topic?.topicCode}</span></div>
                                                        <div>Tên tiếng Anh: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.topic?.ideaVersion?.englishName}</span></div>
                                                        <div>Ten tiếng Việt: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.topic?.ideaVersion?.vietNamName}</span></div>
                                                        <div>Tên viết tắt: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.topic?.ideaVersion?.abbreviations}</span></div>
                                                        <div>Mô tả: <span className={"font-medium ml-2"}>{capstoneSchedule.project?.topic?.ideaVersion?.description}</span></div>
                                                        <div>Đề tài doanh nghiệp:
                                                            <Button
                                                                className={"ml-4"}
                                                                variant={capstoneSchedule.project?.topic?.ideaVersion?.idea?.isEnterpriseTopic != null ? "destructive" : "ghost"}>{capstoneSchedule.project?.topic?.ideaVersion?.idea?.isEnterpriseTopic != null ? "No" : capstoneSchedule.project?.topic?.ideaVersion?.enterpriseName}</Button>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </CardContent>
                                    <CardFooter className={"w-full"} >
                                        <div className={"w-full flex flex-col gap-8 mb-8"}>
                                            <div className={"font-bold text-lg mb-2"}>Thông tin về defense </div>
                                            <div className={"flex flex-col gap-4"}>
                                                <div className={"flex flex-row gap-4 items-center"}>
                                                    <Label className={"font-bold text-sm"}>Stage: </Label>
                                                    <Input readOnly className={"w-[2rem]"} value={capstoneSchedule.stage} />
                                                </div>
                                                <div className={"flex flex-row gap-4 items-center"}>
                                                    <Label className={"font-bold text-sm w-[2rem]"}>Ngày: </Label>
                                                    <Input readOnly className={"w-[10vw]"} value={capstoneSchedule.date ? new Date(capstoneSchedule.date).toLocaleDateString("en-GB") : undefined} />
                                                </div>
                                                <div className={"flex flex-row gap-4 items-center"}>
                                                    <Label className={"font-bold text-sm min-w-9"}>Thời gian: </Label>
                                                    <Input readOnly className={"w-[10vw]"} value={capstoneSchedule.time} />
                                                </div>
                                                <div className={"flex flex-row gap-4 items-center"}>
                                                    <Label className={"font-bold text-sm min-w-9"}>Địa điểm: </Label>
                                                    <Input readOnly className={"w-[10vw]"} value={capstoneSchedule.hallName} />
                                                </div>
                                                <div className={"flex flex-col gap-4"}>
                                                    <Label className={"font-bold text-sm"}>Danh sách sinh viên: </Label>
                                                    {capstoneSchedule.project?.teamMembers && capstoneSchedule.stage && (
                                                        <DefenseTeamMembersTable stage={capstoneSchedule.stage} sinhViens={capstoneSchedule.project?.teamMembers}  />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        </div>
    );

};

export default DefenseDetailsComponent;