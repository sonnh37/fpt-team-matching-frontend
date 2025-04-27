"use client";
import React, { useEffect, useState } from 'react'
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
import { PlusCircle } from 'lucide-react';
import DetailFormCriteria from '../criteria-form-detail/detail-form';
import { Pagination } from '@/components/ui/pagination';
import { CriteriaFormGetAllQuery } from '@/types/models/queries/criteria-form-get-all-query.ts/criteria-form-get-all-query';

const CriteriaFormTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [title, setTitle] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [queryParams, setQueryParams] = useState<CriteriaFormGetAllQuery>({
        title: "",
        pageNumber: 1,
        pageSize: 5,
        isDeleted: false,
        isPagination: true,
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };



    const {
        data: form,
        refetch
    } = useQuery({
        queryKey: ["getALlFormCriteria", queryParams],
        queryFn: () => criteriaFormService.getAll(queryParams),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setQueryParams((prev) => ({
            ...prev,
            pageNumber: currentPage,
        }));
    }, [currentPage]);

    useEffect(() => {
        if (form?.data) {
            setTotalPages(form?.data?.totalPages || 1);
            // Chỉ reset về trang 1 nếu dữ liệu mới có số trang nhỏ hơn trang hiện tại
            if (form.data.pageNumber && currentPage > form.data.pageNumber) {
                setCurrentPage(1);
            }
        }
    }, [form]);

    console.log(form, "testform")

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
            const result = await criteriaFormService.delete(id)
            if (result.status == 1) {
                toast.success("Xóa thành công lời mời!")
                refetch();
            }
        } else {
            return
        }

    }

    const handleSearch = () => {
        setQueryParams((prev) => ({
            ...prev,
            title: search,   // lấy từ khóa từ input
            pageNumber: 1,      // reset về trang 1 khi search
        }));
    };
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
                        id='search'
                        name='search'
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />

                    {/* Search Buttons */}
                    <Button className=" bg-blue-500 hover:bg-blue-600" onClick={() => handleSearch()}>
                        Tìm kiếm
                    </Button>

                </div>

                {/* Right: Create Form Button */}
                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="px-6 py-2  hover:bg-orange-700"> <PlusCircle className='' />Tạo đơn</Button>
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

                </div>
            </div>

            {(form?.data?.results && form.data.results.length < 0) ? (
                <Table>
                    <TableCaption>Danh sách các đơn sẵn có. <br />
                        <div className='my-4 w-full flex justify-center items-center text-black'>
                            Hiện tại chưa có đơn nào.
                        </div>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Số thứ tự</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>Tên người nộp</TableHead>
                            <TableHead>Tên đơn</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-center">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>

                </Table>

            ) : (
                <Table>
                    <TableCaption>Danh sách các đơn sẵn có.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Số thứ tự</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>Tên người nộp</TableHead>
                            <TableHead>Tên đơn</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-center">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {form?.data?.results?.map((cv, index) => (
                            <TableRow key={cv.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
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
                                        <button className="w-[104px] h-9 p-2 bg-red-600 rounded-sm text-white">
                                            Đã xóa
                                        </button>
                                    ) : (
                                        <button className=" p-2 bg-green-500 rounded-sm text-white">
                                            Đang sử dụng
                                        </button>
                                    )}
                                </TableCell>
                                {/* <TableCell >   <button className="p-2 bg-orange-400 ml-3 rounded-sm"><a href={`/social/blog/profile-social/${cv.user?.id}`}>Xem profile</a></button></TableCell> */}
                                <TableCell className='flex justify-center items-center' >
                                    <Button variant={"destructive"} onClick={() => handleDelete(cv.id ?? "")}> Xóa đơn</Button>
                                    <DetailFormCriteria id={cv.id ?? ""} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
            )

            }

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />



        </div>

    )
}

export default CriteriaFormTable
