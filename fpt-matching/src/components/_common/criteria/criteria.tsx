"use client";
import React, { useState } from 'react'
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
import { criteriaService } from '@/services/criteria-service';
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { divide } from 'lodash';


const Criteria = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
      });
      
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

    const {
        data: form,
        refetch
    } = useQuery({
        queryKey: ["getCriteria"],
        queryFn: () => criteriaService.getAll(),
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
            const result = await criteriaService.deletePermanent(id)
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
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                {/* Left: Search and buttons */}
                <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />

                    {/* Search Buttons */}
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Search 1
                    </button>
                   
                </div>

                {/* Right: Create Form Button */}
                <div>
                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Tạo Form
                    </button>
                </div>
            </div>

            {(form?.data?.results && form.data.results.length < 0) ? (<div className='my-4 w-full flex justify-center'>
                Hiện tại chưa có đơn nào.
            </div>) : (<Table>
                <TableCaption>Danh sách các đơn sẵn có.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Số thứ tự</TableHead>
                        <TableHead>Ngày nộp</TableHead>
                        <TableHead>Tên người nộp</TableHead>
                        <TableHead>Tên câu hỏi</TableHead>
                        <TableHead>Miêu tả</TableHead>
                        <TableHead className="max-h-[500px] overflow-x-auto whitespace-nowrap">Thể loại</TableHead>
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
                            <TableCell >{cv.name}</TableCell>
                            <TableCell >{cv.description}</TableCell>
                            <TableCell >{cv.valueType}</TableCell>
                            <TableCell>
                                {cv.isDeleted ? (
                                    <div className=" text-blue-500">
                                        Đã xóa
                                    </div>
                                ) : (
                                    <div className=" text-blue-500">
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

export default Criteria
