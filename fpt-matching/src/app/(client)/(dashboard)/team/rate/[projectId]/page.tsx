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
import { rateService } from '@/services/rate-service';
import { useParams } from 'next/navigation';
import { TeamMemberRole } from '@/types/enums/team-member';

export default function Page() {
    const { projectId } = useParams<{ projectId: string }>(); // Lấy giá trị từ params
    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)
    const {
        data: result,
        refetch,
    } = useQuery({
        queryKey: ["getTeamInfo", projectId],
        queryFn: () => projectService.getById(projectId),
        refetchOnWindowFocus: false,
    });

    //   Loc member ngoai thang danh gia
    const member = result?.data?.teamMembers


    console.log(member, "test")

    const { data: ratingData } = useQuery({
        queryKey: ["getAllRates"],
        queryFn: () => rateService.getAll(), // API trả về danh sách các đánh giá
        refetchOnWindowFocus: false,
    });
    const checkLeader = result?.data?.teamMembers
    .filter(x => x.role == TeamMemberRole.Leader) // Lọc ra các thành viên có vai trò là Leader
    .some(r => r.userId == user?.id);   


    return (
        <div>
            <h1 className='font-semibold text-2xl ml-4'>Danh sách đánh giá </h1>
            <Table className='ml-4 mt-5 text-lg'>
                <TableCaption>Danh sách thành viên trong nhóm.</TableCaption>
                <TableHeader>
                    <TableRow className=''>
                        <TableHead className="w-[100px]">Số thứ tự</TableHead>
                        <TableHead className="">Tên nhóm</TableHead>
                        <TableHead className="">Chuyên ngành</TableHead>
                        {/* <TableHead className="">Người hướng dẫn</TableHead> */}
                        <TableHead>Tên thành viên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Đánh giá</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {member?.map((cv, index) => {
                        const hasRated = ratingData?.data?.results?.some(
                            (r) => r.rateById === user?.teamMembers.find(x => x.userId == user?.id)?.id && r.rateForId === cv.id
                        );

                        return (
                            <TableRow key={cv.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{result?.data?.teamName}</TableCell>
                                <TableCell>
                                    {cv.user?.profileStudent?.specialty?.specialtyName}
                                </TableCell>
                                {/* <TableCell>{result?.data?.topic?.topicVersion?.}</TableCell> */}
                                <TableCell>
                                    {cv.user?.lastName} {cv.user?.firstName}
                                </TableCell>
                                <TableCell>{cv.user?.email}</TableCell>

                                <TableCell>
                                    {hasRated ? (
                                        <span className="text-green-600 font-semibold">Bạn đã đánh giá</span>
                                    ) : checkLeader ? (
                                        <RateStudent id={cv.id ?? ""} projectId={projectId ?? ""} />
                                    ) : (
                                        <span className="text-red-500">Không có quyền hạn đánh giá</span>
                                    )}

                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
                <TableFooter>

                </TableFooter>
            </Table>



        </div>

    );
}
