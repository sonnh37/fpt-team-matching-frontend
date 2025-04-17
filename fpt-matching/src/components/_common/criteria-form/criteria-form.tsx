"use client";
import React from 'react'
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
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { divide } from 'lodash';


const CriteriaForm = () => {

    const {
        data: form,
        refetch
    } = useQuery({
        queryKey: ["getFormCriteria"],
        queryFn: () => criteriaFormService.fetchAll(),
        refetchOnWindowFocus: false,
    });

    //Đây là form delete trả về true false tái sử dụng được
    const confirm = useConfirm()
    const handleDelete = async (id: string) => {

        // Gọi confirm để mở dialog
        const confirmed = await confirm({
            title: "Xóa yêu cầu gia nhập",
            description: "Bạn có muốn xóa đơn này không?",
            confirmText: "Có,xóa nó đi",
            cancelText: "Không,cảm ơn",
        })
        if (confirmed) {
            const result = await criteriaFormService.deletePermanent(id)
            if (result.status == 1) {
                toast.success("Xóa thành công lời mời!")
                refetch();
            }
        } else {
            return
        }

    }
    return (
        <div>
            {form?.data?.results ? (<div className='my-4 w-full flex justify-center'>
              Hiện tại chưa có đơn nào.
            </div>) : (<Table>
                <TableCaption>Danh sách các đơn sẵn có.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Số thứ tự</TableHead>
                        <TableHead>Ngày nộp</TableHead>
                        <TableHead>Tên người nộp</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="max-h-[500px] overflow-x-auto whitespace-nowrap">File CV</TableHead>
                        <TableHead className="text-center">Profile </TableHead>
                        <TableHead className="text-center">Action </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {form?.data?.results?.map((cv, index) => (
                        <TableRow key={cv.id}>
                            <TableCell className="font-medium">{index}</TableCell>
                            <TableCell className="font-medium">{cv.createdDate ? new Date(cv.createdDate).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit"
                            })
                                : "Không có ngày "}</TableCell>
                            <TableCell>{cv.createdBy}  </TableCell>
                            <TableCell >{cv.title}</TableCell>
                            <TableCell>
                                {cv.isDeleted ? (
                                    <div className="border-b-2 border-blue-500 text-blue-500">
                                        Đã xóa
                                    </div>
                                ) : (
                                    <div className="border-b-2 border-blue-500 text-blue-500">
                                        Đang sử dụng
                                    </div>
                                )}
                            </TableCell>
                            {/* <TableCell >   <button className="p-2 bg-orange-400 ml-3 rounded-sm"><a href={`/social/blog/profile-social/${cv.user?.id}`}>Xem profile</a></button></TableCell> */}
                            <TableCell >   <button className="p-2 bg-red-600 ml-3 rounded-sm" onClick={() => handleDelete(cv.id ?? "")}> Xóa CV</button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>

                </TableFooter>
            </Table>)

            }

        </div>

    )
}

export default CriteriaForm
