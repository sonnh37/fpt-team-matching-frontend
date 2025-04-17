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
import { criteriaFormService } from "@/services/criteria-form-service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
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
import { CriteriaFormCreateCommand } from '@/types/models/commands/criteria-form/criteria-forn-create-command';


const CriteriaForm = () => {

    const [title, setTitle] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const {
        data: form,
        refetch
    } = useQuery({
        queryKey: ["getFormCriteria"],
        queryFn: () => criteriaFormService.getAll(),
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
    const handCreate = async () => {

        let query: CriteriaFormCreateCommand = {
            title: title
        }

        const result = await criteriaFormService.create(query)
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
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Search
                    </button>

                </div>

                {/* Right: Create Form Button */}
                <div>
                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div>Tạo Đơn</div>
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
                                            Tiêu đề:
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            value={title}
                                            onChange={handleChange}
                                            className="col-span-3"
                                        />

                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={() => handCreate()} >Lưu đơn</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </button>
                </div>
            </div>

            {(form?.data?.results && form.data.results.length < 0) ? (<div className='my-4 w-full flex justify-center'>
                Hiện tại chưa có đơn nào.
            </div>) : (
                <Table>
                    <TableCaption>Danh sách các đơn sẵn có.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Số thứ tự</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>Tên người nộp</TableHead>
                            <TableHead>Tên đơn</TableHead>
                            <TableHead>Trạng thái</TableHead>
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
                                <TableCell className=' justify-center'>
                                    {cv.isDeleted ? (
                                        <button className=" p-2 bg-red-600 rounded-sm">
                                            Đã xóa
                                        </button>
                                    ) : (
                                        <button className=" p-2 bg-green-600 rounded-sm">
                                            Đang sử dụng
                                        </button>
                                    )}
                                </TableCell>
                                {/* <TableCell >   <button className="p-2 bg-orange-400 ml-3 rounded-sm"><a href={`/social/blog/profile-social/${cv.user?.id}`}>Xem profile</a></button></TableCell> */}
                                <TableCell className='flex justify-center' >
                                    <button className="p-2 bg-red-600 ml-3 rounded-sm" onClick={() => handleDelete(cv.id ?? "")}> Xóa CV</button>
                                    <button className="p-2 bg-orange-400 ml-3 rounded-sm" onClick={() => handleDelete(cv.id ?? "")}>Chi tiết</button>
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

export default CriteriaForm
