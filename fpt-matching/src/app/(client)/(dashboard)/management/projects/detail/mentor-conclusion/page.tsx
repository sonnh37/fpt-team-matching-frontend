'use client'
import React, {useEffect, useState} from 'react';
import { useSearchParams } from "next/navigation";
import { Label } from '@/components/ui/label';
import {Plus} from "lucide-react";
import { Input } from '@/components/ui/input';
import {projectService} from "@/services/project-service";
import {Project} from "@/types/project";
import {TeamMember} from "@/types/team-member";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Textarea} from "@/components/ui/textarea";
import SupervisorComment from './supervisor-comment';
import {Button} from "@/components/ui/button";
import {MentorFeedback} from "@/types/mentor-feedback";
import {teammemberService} from "@/services/team-member-service";
import TeamMemberUpdateMentorConclusion
    from "@/types/models/commands/team-members/team-member-update-mentor-conclusion";
import {toast} from "sonner";
import {mentorFeedbackService} from "@/services/mentor-feedback-service";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
const TableOfSinhVien = ({sinhViens} : {sinhViens: TeamMember[]}) => {
    return (
        <Table>
            <TableCaption>Danh sách sinh viên sẽ bảo vệ khoá luận</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead className="w-[100px]">Mã số sinh viên</TableHead>
                    <TableHead>Họ tên</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sinhViens.map((sinhVien, index) => (
                    <TableRow key={sinhVien.id}>
                        <TableCell className="font-medium">{index}</TableCell>
                        <TableCell>{sinhVien.user?.code}</TableCell>
                        <TableCell>{sinhVien.user?.firstName + " " + sinhVien.user?.lastName}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}

const Page = () => {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const [project, setProject] = useState<Project | null>(null);
    const [sinhViens, setSinhViens] = useState<TeamMember[]>([]);
    const [mentorFeedback, setMentorFeedback] = useState<MentorFeedback | null>(null);
    useEffect(() => {
        if (!projectId) {
            return;
        }
        const fetchData = async () => {
            const response = await projectService.fetchById(projectId);
            if (response && response.data) {
                setProject(response.data)
                console.log(response.data)
                if (response.data.mentorFeedback){
                    setMentorFeedback(response.data.mentorFeedback);
                } else {
                    const newMentorFeedback : MentorFeedback = {projectId: projectId} as MentorFeedback;
                    setMentorFeedback(newMentorFeedback)
                }
                if (response.data.teamMembers) {
                    setSinhViens(response.data.teamMembers);
                }
            }
        }
        fetchData()
    }, [projectId]);
    console.log(mentorFeedback)
    const handleSaveChange = async () => {
        console.log(project);
        if (sinhViens.some(x => x.id == null)) {
            toast.error("Có lỗi khi cập nhật")
            return;
        }
        if (sinhViens.filter(x => x.attitude == null || x.attitude == "").length > 0 || sinhViens.filter(x => x.mentorConclusion == null).length > 0) {
            toast.error("Vui lòng điền tất cả các field")
            return;
        }
        const teamMemberConclusion : TeamMemberUpdateMentorConclusion[] = [] as TeamMemberUpdateMentorConclusion[];
        sinhViens.forEach((sinhVien) => {
            return teamMemberConclusion.push({id: sinhVien.id!, mentorConclusion: sinhVien.mentorConclusion!, attitude: sinhVien.attitude!, note: sinhVien.note!});
        })
        if (!mentorFeedback || !mentorFeedback.limitation || !mentorFeedback.thesisContent || !mentorFeedback.thesisForm || !mentorFeedback.achievementLevel) {
            toast.error("Vui lòng điền tất cả các field")
            return;
        }
        const teamMemberResponse = await  teammemberService.updateByMentor({teamMembersConclusion: teamMemberConclusion})
        const mentorFeedbackResponse = await mentorFeedbackService.postFeedback(mentorFeedback);
        if (mentorFeedbackResponse.status == 1 || teamMemberResponse.status == 1) {
            toast.success("Save success")
        } else {
            toast.error(teamMemberResponse.status != 1 ? teamMemberResponse.message : mentorFeedbackResponse.message)
        }
    }
    return (
        <div className={"p-8"}>
            {/*Start 1*/}
            <div className={"flex justify-between gap-4"}>
                {/*1.1*/}
                <div className={"w-2/3"}>
                    <Label className={"text-lg font-bold"}>1. Tên Khoá luận tốt nghiệp | Thesis title</Label>
                    {/*1.1.1*/}
                    <div className={"mx-4 mt-2 flex flex-col gap-2 "}>
                        <Label className={"text-sm mt-2 font-bold flex flex-row items-center gap-2"}>{<Plus className={"size-4"} />} Tiếng việt | Vietnamese: </Label>
                        <Input readOnly={true} className={"w-3/4"} value={project?.idea?.vietNamName ?? ""} />
                    </div>

                    {/*1.1.2*/}
                    <div className={"mx-4 mt-2 flex flex-col gap-2"}>
                        <Label className={"text-sm mt-2 font-bold flex flex-row items-center gap-2"}>{<Plus className={"size-4"} />} Tiếng anh | English: </Label>
                        <Input readOnly={true} className={"w-3/4"} value={project?.idea?.englishName ?? ""} />
                    </div>
                </div>

                {/*1.2*/}
                <div className={"w-1/3"}>
                    <Label className={"text-lg font-bold"}>2. Họ tên những sinh viên sẽ bảo vệ khoá luận | Students of the thesis defense: </Label>
                    {project?.teamMembers &&   <TableOfSinhVien sinhViens={project?.teamMembers} />}
                </div>
            </div>
            {/*End 1*/}

            {/*Start 2*/}
            <div className={"flex flex-col gap-2"}>
                <Label className={"text-lg font-bold"}>3. Nhận xét của giảng viên hướng dẫn | Comment from proposed Supervisor: </Label>
                {/*2.1*/}
                <div className={"flex flex-col gap-2"}>
                    <Label className={"text-sm mt-2 ml-4 font-bold items-center gap-2"}>
                        <p>3.1 - Nội dung khoá luận (so với mục tiêu nghiên cứu, cơ sở lý luận, số liệu, phân tích, tính ứng dụng)</p>
                        <p className={"ml-8"}>Thesis content (compare the research objectives, theoretical basis, data, analysis, application, etc)</p>
                    </Label>
                    <Textarea
                        onChange={(event) => {
                            setMentorFeedback((prev) => {
                                if (!prev)
                                    return null;
                            prev.thesisContent = event.target.value
                            return prev
                            })
                        }}
                        defaultValue={mentorFeedback && mentorFeedback.thesisContent ? mentorFeedback.thesisContent : undefined} className={"w-1/2"}/>
                </div>

                {/*2.2*/}
                <div className={"flex flex-col gap-2"}>
                    <Label className={"text-sm mt-2 ml-4 font-bold items-center gap-2"}>
                        <p>3.2 - Hình thức của khoá luận (bố cục, phương pháp trình bày, tiếng Anh, trích dẫn)</p>
                        <p className={"ml-8"}>Thesis form (Layout, presentation, methods, English, citation)</p>
                    </Label>
                    <Textarea
                        onChange={(event) => {
                            setMentorFeedback((prev) => {
                                if (!prev)
                                    return null;
                                prev.thesisForm = event.target.value
                                return prev
                            })
                        }}
                        defaultValue={mentorFeedback && mentorFeedback.thesisForm ? mentorFeedback.thesisForm : undefined} className={"w-1/2"}/>
                </div>


            </div>
            {/*End 2*/}

            {/*Start 3*/}
            <div className={"w-full flex flex-col gap-4"}>
                <Label className={"text-lg font-bold"}>4. Kết luận: Đạt ở mức nào ? (hoặc không đạt) | Conclusion: Pass at what stage ? (Or not)</Label>
                <div className={"w-full flex flex-row justify-between gap-8"}>
                    {/*3.1*/}
                    <div className={"w-1/2 flex flex-col gap-2"}>
                        <Label className={"text-sm mt-2 ml-4 font-bold items-center gap-2"}>
                            <p>4.1 - Mức độ đạt được so với mục tiêu (so với đề cương)</p>
                            <p className={"ml-8"}>Achivement level compare to the target (compare to the plan)</p>
                        </Label>
                        <Textarea
                            onChange={(event) => {
                                setMentorFeedback((prev) => {
                                    if (!prev)
                                        return null;
                                    prev.achievementLevel = event.target.value
                                    return prev
                                })
                            }}
                            defaultValue={mentorFeedback && mentorFeedback.achievementLevel ? mentorFeedback.achievementLevel : undefined} className={"w-2/3"}/>
                    </div>

                    {/*3.2*/}
                    <div className={"w-1/2 flex flex-col gap-2"}>
                        <Label className={"text-sm mt-2 ml-4 mb-5 font-bold items-center gap-2"}>
                            <p>4.2 - Hạn chế | Limitation</p>
                        </Label>
                        <Textarea
                            onChange={(event) => {
                                setMentorFeedback((prev) => {
                                    if (!prev)
                                        return null;
                                    prev.limitation = event.target.value
                                    return prev
                                })
                            }}
                            defaultValue={mentorFeedback && mentorFeedback.limitation ? mentorFeedback.limitation : undefined} className={"w-2/3"}/>
                    </div>
                </div>
            </div>
            {/*End 3*/}

            {/*Start 4*/}
            <div>
                <Label className={"text-sm mb-4 mt-2 ml-4 font-bold items-center gap-2"}>
                    <p>4.3 - Ý kiến của giảng viên</p>
                    <p className={"ml-8"}>Proposed Supervisor comment</p>
                </Label>
                <div>
                    {(project && project.teamMembers?.length > 0) &&  <SupervisorComment setSinhViens={setSinhViens} sinhViens={sinhViens} />}
                </div>
            </div>
            <div className={"mt-4"}>
                <Label className={"text-sm mb-8 mt-2 ml-4 font-bold items-center gap-2"}>
                    <p>4.4 - Kết luận cuối cùng | Final conclusion</p>
                    {/*<p className={"ml-8"}></p>*/}
                </Label>
                <div className={"mt-4"}>
                    <Select defaultValue={project?.defenseStage ? project.defenseStage.toString() : undefined} onValueChange={(e) => {
                        setProject((prev) => {
                            if (!prev)
                                return null;
                            prev.defenseStage = parseInt(e)
                            return prev
                        })
                    }}>
                        <SelectTrigger className="w-[40%]">
                            <SelectValue placeholder="Quyết định giao đoạn ra hội đồng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chọn giai đoạn</SelectLabel>
                                <SelectItem value="1">Lần 1</SelectItem>
                                <SelectItem value="2">Lần 2</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/*End 4*/}
            <div className={"mt-6"}>
                <Button onClick={()=>{
                    handleSaveChange()
                }} variant={"default"} >Save change</Button>
            </div>
        </div>
    );
};

export default Page;