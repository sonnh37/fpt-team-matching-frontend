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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CriteriaCreateCommand } from '@/types/models/commands/criteria/criteria-create-command';
import { PlusCircle } from 'lucide-react';

const Criteria = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        valueType: "",
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
            const result = await criteriaService.delete(id)
            if (result.status == 1) {
                toast.success("Xóa thành công lời mời!")
                refetch();
            }
        } else {
            return
        }

    }

    const handCreate = async () => {

        let query: CriteriaCreateCommand = {
            name: formData.name,
            description: formData.description,
            valueType: formData.valueType
        }

        const result = await criteriaService.create(query)
        if (result.status == 1) {
            toast.success("Tạo thành công đơn!")
            refetch();
        }


    }
    return (
        <div className='bg-slate-50 border-2 rounded-sm shadow-lg p-4'>
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
                    <Button className=" bg-blue-500 hover:bg-blue-600">
                        Tìm kiếm
                    </Button>


                </div>

                {/* Right: Create Form Button */}
                <div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="px-6 py-2  hover:bg-orange-700"> <PlusCircle className='' />Tạo tiêu chí</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Form tạo đơn tiêu chí</DialogTitle>
                                <DialogDescription>
                                    Đây là đơn để tạo form tiêu chí đánh giá.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Câu hỏi:
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        onChange={handleChange}
                                        className="col-span-3"
                                    />

                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Miêu tả:
                                    </Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        onChange={handleChange}
                                        className="col-span-3"
                                    />

                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Loại:
                                    </Label>
                                    <select
                                        id="valueType"
                                        name="valueType"
                                        onChange={handleChange}
                                        className="col-span-3"
                                    >
                                        <option value="">Chọn loại</option>
                                        <option value="Sai hay đúng">Sai hay đúng</option>
                                        <option value="Đóng góp ý kiến">Đóng góp ý kiến</option>
                                    </select>

                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={() => handCreate()} >Lưu đơn</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


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
                        <TableHead className="text-center">Trạng thái </TableHead>
                        <TableHead className="text-center">Hành động </TableHead>
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
                            <TableCell className=' justify-center'>
                                {cv.isDeleted ? (
                                    <button className=" p-2 bg-red-600 rounded-sm">
                                        Đã xóa
                                    </button>
                                ) : (
                                    <button className=" p-2 bg-green-500 rounded-sm">
                                        Đang sử dụng
                                    </button>
                                )}
                            </TableCell>
                            {/* <TableCell >   <button className="p-2 bg-orange-400 ml-3 rounded-sm"><a href={`/social/blog/profile-social/${cv.user?.id}`}>Xem profile</a></button></TableCell> */}
                            <TableCell className='flex justify-center' >
                                <Button variant={"destructive"} onClick={() => handleDelete(cv.id ?? "")}> Xóa đơn</Button>
                                <Button className="p-2 px-4 bg-blue-500  ml-3 rounded-sm text-white" >Chi tiết</Button>
                            </TableCell>
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
