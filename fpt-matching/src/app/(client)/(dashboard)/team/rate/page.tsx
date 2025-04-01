"use client"
import { RootState } from '@/lib/redux/store';
import { projectService } from '@/services/project-service';
import { ProjectStatus } from '@/types/enums/project';
import { Rate } from '@/types/rate';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import RateStudent from '@/components/_common/rate-student/rate-student';

export default function Page() {

    const [formData, setformData] = useState({
        rateById: "",
        rateForId: "",
        numOfStar: 1,
        content: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

    };

    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)
    const {
        data: result,
        refetch,
    } = useQuery({
        queryKey: ["getTeamInfo"],
        queryFn: projectService.getProjectInfo,
        refetchOnWindowFocus: false,
    });
    //   Loc member ngoai thang danh gia
    const member = result?.data?.teamMembers.filter(x => x.userId != user?.id)

    const handlSubmit = async () => {

    }



    return (
        <div>
            <h1 className='font-semibold text-2xl ml-4'>Danh sách đánh giá </h1>
            <Table className='ml-4 mt-5 text-lg'>
                <TableCaption>Danh sách nộp ứng tuyển.</TableCaption>
                <TableHeader>
                    <TableRow className=''>
                        <TableHead className="w-[100px]">Số thứ tự</TableHead>
                        <TableHead className="">Tên nhóm</TableHead>
                        <TableHead className="">Chuyển ngành</TableHead>
                        <TableHead className="">Người hướng dẫn</TableHead>
                        <TableHead>Tên thành viên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Đánh giá</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {member?.map((cv, index) => (
                        <TableRow key={cv.id}>
                            <TableCell className="font-medium ">{index +1}</TableCell>
                            <TableCell>{result?.data?.teamName}  </TableCell>
                            <TableCell>{cv.user?.profileStudent?.specialty?.profession?.professionName}</TableCell>
                            <TableCell >{result?.data?.idea?.mentorId} </TableCell>
                            <TableCell >{cv.user?.lastName}{cv.user?.firstName}</TableCell>
                            <TableCell >  {cv.user?.email}</TableCell>
                            <TableCell >   <RateStudent id={cv.id ?? ""}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>

                </TableFooter>
            </Table>

        

        </div>

    );
}
