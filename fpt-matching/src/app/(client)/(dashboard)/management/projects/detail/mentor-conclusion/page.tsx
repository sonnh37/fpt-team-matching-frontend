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
    useEffect(() => {
        if (!projectId) {
            return;
        }
        const fetchData = async () => {
            const response = await projectService.fetchById(projectId);
            if (response && response.data) {
                console.log(response.data)
                setProject(response.data)
            }
        }
        fetchData()
    }, [projectId]);
    // console.log(project);
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
                        <Input className={"w-3/4"} placeholder={"Nhập tên đề tài tiếng việt"} />
                    </div>

                    {/*1.1.2*/}
                    <div className={"mx-4 mt-2 flex flex-col gap-2"}>
                        <Label className={"text-sm mt-2 font-bold flex flex-row items-center gap-2"}>{<Plus className={"size-4"} />} Tiếng anh | English: </Label>
                        <Input className={"w-3/4"} placeholder={"Nhập tên đề tài tiếng anh"} />
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
                    <Textarea className={"w-1/2"}/>
                </div>

                {/*2.2*/}
                <div className={"flex flex-col gap-2"}>
                    <Label className={"text-sm mt-2 ml-4 font-bold items-center gap-2"}>
                        <p>3.2 - Hình thức của khoá luận (bố cục, phương pháp trình bày, tiếng Anh, trích dẫn)</p>
                        <p className={"ml-8"}>Thesis form (Layout, presentation, methods, English, citation)</p>
                    </Label>
                    <Textarea className={"w-1/2"}/>
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
                        <Textarea className={"w-2/3"}/>
                    </div>

                    {/*3.2*/}
                    <div className={"w-1/2 flex flex-col gap-2"}>
                        <Label className={"text-sm mt-2 ml-4 mb-5 font-bold items-center gap-2"}>
                            <p>4.2 - Hạn chế | Limitation</p>
                        </Label>
                        <Textarea className={"w-2/3"}/>
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
                    {(project && project.teamMembers?.length > 0) &&  <SupervisorComment sinhViens={project?.teamMembers} />}
                </div>
                <div className={"mt-6"}>
                    <Button variant={"default"} >Save change</Button>
                </div>
            </div>
            {/*End 4*/}
        </div>
    );
};

export default Page;