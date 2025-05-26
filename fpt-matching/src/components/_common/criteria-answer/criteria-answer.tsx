"use client";
import { useState } from 'react'

import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import { criteriaFormService } from "@/services/criteria-form-service";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"

import { CriteriaFormCreateCommand } from '@/types/models/commands/criteria-form/criteria-forn-create-command';

import { Pagination } from '@/components/ui/pagination';

import FormAnswer from './detail-form-answer';
import {TopicVersionRequestGetAllQuery} from "@/types/models/queries/topic-request/topic-version-request-get-all-query";
import { TopicVersionRequestStatus } from '@/types/enums/topic-version-request';


const CriteriaAnswerManagement = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [title, setTitle] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [queryParams, setQueryParams] = useState<TopicVersionRequestGetAllQuery>({

        pageNumber: 1,
        pageSize: 5,
        isDeleted: false,
        isPagination: true,
        createdBy: title
    });
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setTitle(e.target.value);
    // };

    const {
        data: form,
        refetch
    } = useQuery({
        queryKey: ["getAllTopicVersion", queryParams],
        // queryFn: () => topicVersionRequestService.getAllExceptPending(queryParams),
        refetchOnWindowFocus: false,
    });



    // useEffect(() => {
    //     setQueryParams((prev) => ({
    //         ...prev,
    //         pageNumber: currentPage,
    //     }));
    // }, [currentPage]);
    //
    // useEffect(() => {
    //     if (form?.data) {
    //         setTotalPages(form?.data?.totalPages || 1);
    //         // Chỉ reset về trang 1 nếu dữ liệu mới có số trang nhỏ hơn trang hiện tại
    //         if (form.data.pageNumber && currentPage > form.data.pageNumber) {
    //             setCurrentPage(1);
    //         }
    //     }
    // }, [form]);


    //Đây là form delete trả về true false tái sử dụng được
    const confirm = useConfirm()
    const handleDelete = async (id: string) => {

        // Gọi confirm để mở dialog
        const confirmed = await confirm({
            title: "Xóa đi form kết quả",
            description: "Bạn có muốn xóa đơn này không?",
            confirmText: "Có,xóa nó đi",
            cancelText: "Không,cảm ơn",
        })
        if (confirmed) {
            const result = await criteriaFormService.delete(id)
            if (result.status == 1) {
                toast.success("Xóa thành công đơn!")
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
    const statusMap = {
        [TopicVersionRequestStatus.Approved]: {
            text: "Đã duyệt",
            className: "bg-green-500 text-white",
        },
        [TopicVersionRequestStatus.Rejected]: {
            text: "Đã từ chối",
            className: "bg-red-600 text-white",
        },
        [TopicVersionRequestStatus.Consider]: {
            text: "Yêu cầu sửa",
            className: "bg-yellow-500 text-white",
        },
    };
    // return (
    //     <div className='bg-slate-50 border-2 rounded-sm shadow-lg p-4'>
    //         <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
    //             {/* Left: Search and buttons */}
    //             <div className="flex items-center gap-2">
    //                 {/* Search Input */}
    //                 <input
    //                     id='search'
    //                     name='search'
    //                     onChange={(e) => setSearch(e.target.value)}
    //                     type="text"
    //                     placeholder="Tìm kiếm..."
    //                     className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
    //                 />
    //
    //                 {/* Search Buttons */}
    //                 {/*<Button className=" bg-blue-500 hover:bg-blue-600" onClick={() => handleSearch()}>*/}
    //                 {/*    Tìm kiếm*/}
    //                 {/*</Button>*/}
    //
    //             </div>
    //
    //
    //         </div>
    //
    //         {(form?.data?.results && form.data.results.length < 0) ? (
    //             <Table>
    //                 <TableCaption>Danh sách các đơn đã đánh giá. <br />
    //                     <div className='my-4 w-full flex justify-center items-center text-black'>
    //                         Hiện tại chưa có đơn nào.
    //                     </div>
    //                 </TableCaption>
    //                 <TableHeader>
    //                     <TableRow>
    //                         <TableHead className="w-[100px]">Số thứ tự</TableHead>
    //                         <TableHead>Ngày nộp</TableHead>
    //                         <TableHead>Tên người nộp</TableHead>
    //                         <TableHead>Tên đơn</TableHead>
    //                         <TableHead>Trạng thái</TableHead>
    //                         <TableHead className="text-center">Hành động</TableHead>
    //                     </TableRow>
    //                 </TableHeader>
    //
    //             </Table>
    //
    //         ) : (
    //             <Table>
    //                 <TableCaption>Danh sách các đơn sẵn có.</TableCaption>
    //                 <TableHeader>
    //                     <TableRow>
    //                         <TableHead className="w-[100px]">Số thứ tự</TableHead>
    //                         <TableHead>Ngày nộp</TableHead>
    //                         <TableHead>Tên người nộp</TableHead>
    //                         <TableHead>Tên đề tài</TableHead>
    //                         <TableHead>Tên đơn</TableHead>
    //                         <TableHead>Trạng thái</TableHead>
    //                         <TableHead className="text-center">Hành động</TableHead>
    //                     </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                     {form?.data?.results?.map((as, index) => {
    //                         const statusInfo = as.status ? statusMap[as.status] : undefined;
    //
    //                         return (
    //                             <TableRow key={as.id}>
    //                                 <TableCell className="font-medium">{index + 1}</TableCell>
    //                                 <TableCell className="font-medium">
    //                                     {as.createdDate
    //                                         ? new Date(as.createdDate).toLocaleString("vi-VN", {
    //                                             day: "2-digit",
    //                                             month: "2-digit",
    //                                             year: "numeric",
    //                                             hour: "2-digit"
    //                                         })
    //                                         : "Không có ngày"}
    //                                 </TableCell>
    //                                 <TableCell>{as.reviewer?.email}</TableCell>
    //                                 <TableCell>{as?.topicVersion?.abbreviations}</TableCell>
    //                                 <TableCell>{as.criteriaForm?.title}</TableCell>
    //                                 <TableCell className="justify-center">
    //                                     {statusInfo && (
    //                                         <span className={`px-2 py-1 rounded-sm ${statusInfo.className}`}>
    //                                             {statusInfo.text}
    //                                         </span>
    //                                     )}
    //                                 </TableCell>
    //                                 <TableCell className="flex justify-center items-center">
    //                                     <FormAnswer
    //                                         criteriaId={as.criteriaFormId}
    //                                         topicVersionRequestId={as.id}
    //                                         isAnswered={(as?.answerCriterias?.length ?? 0) > 0}
    //                                     />
    //                                 </TableCell>
    //                             </TableRow>
    //                         );
    //                     })}
    //                 </TableBody>
    //
    //
    //             </Table>
    //         )
    //
    //         }
    //
    //         <Pagination
    //             currentPage={currentPage}
    //             totalPages={totalPages}
    //             onPageChange={setCurrentPage}
    //         />
    //
    //
    //
    //     </div>
    //
    // )
}

export default CriteriaAnswerManagement
