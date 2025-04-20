import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
    ModalClose,
    ModalFooter,
} from "@/components/ui/animated-modal"
import { Textarea } from '@/components/ui/textarea'
import { useQuery } from '@tanstack/react-query'
import { criteriaFormService } from '@/services/criteria-form-service'
import { PlusCircle } from 'lucide-react';
import { criteriaService } from '@/services/criteria-service'
import { criteriaXCriteriaFormService } from '@/services/criteria-x-criteria-form-service'
import { toast } from 'sonner'
import { CriteriaXCriteriaFormCreateCommand } from '@/types/models/commands/criteria-x-formcriteria/criteria-x-form-create-command'
import { CriteriaXCriteriaFormGetAllQuery } from '@/types/models/queries/criteriaxcriteriaform/criteria-x-criteria-form-get-all-query'
import { CriteriaValueType } from '@/types/enums/criteria'
import { useConfirm } from '../formdelete/confirm-context'
type DetailFormCriteriaProps = {
    id: string;
};
const DetailFormCriteria = ({ id }: DetailFormCriteriaProps) => {
    const [valueQuestion, setValueQuestion] = useState<string | null>(null);

    console.log(valueQuestion, "test")
    const {
        data: form,
        refetch
    } = useQuery({
        queryKey: ["getFormById", id],
        queryFn: () => criteriaFormService.getById(id),
        refetchOnWindowFocus: false,
    });

    



    const {
        data: criteriaAll,
    } = useQuery({
        queryKey: ["getAllCriteria"],
        queryFn: () => criteriaService.getAll(),
        refetchOnWindowFocus: false,
    });

    const criteriaIsExist = criteriaAll?.data?.results?.filter(x => x.isDeleted == false);

    const confirm = useConfirm()
    const handleDelete = async (id: string) => {

     const check = await criteriaXCriteriaFormService.getById(id)
     if(check){
         // Gọi confirm để mở dialog
         const confirmed = await confirm({
            title: "Xóa yêu cầu gia nhập",
            description: "Bạn có muốn xóa đơn này không?",
            confirmText: "Có,xóa nó đi",
            cancelText: "Không,cảm ơn",
        })
        if(confirmed){
            const result = await criteriaXCriteriaFormService.delete(id)
            if(result.status ===1){
                toast.success("Xóa câu hỏi thành công!")
                refetch();
            }else{
                toast.error("Đã có lỗi xảy ra!")
            }
        }
       
     }

    }

    const handCreate = async () => {
        if (!valueQuestion) {
            toast.message("Vui lòng chọn một câu hỏi trước khi thêm.");
            return;
        }
        // let check: CriteriaXCriteriaFormGetAllQuery = {
        //     isPagination:false,
        //     criteriaFormId: id,
        //     criteriaId: valueQuestion
        // }
        // const isExist = await criteriaXCriteriaFormService.getAll(check);
        // if(!isExist.data?.results?.length){
        //     toast.message("Bạn đã có câu hỏi như vậy trong đơn rồi");
        //     return;
        // }
        try {
            let query: CriteriaXCriteriaFormCreateCommand = {
                criteriaFormId: id,
                criteriaId: valueQuestion
            }
            const response = await criteriaXCriteriaFormService.create(query); // giả sử là API này
            if (response.status === 1) {
                toast.success("Thêm tiêu chí thành công!");
                // Optional: reset select hoặc refetch lại dữ liệu nếu cần
                setValueQuestion(null);
                refetch();
            } else {
                toast.error("Đã xảy ra lỗi khi thêm tiêu chí.");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            toast.error("Không thể thêm tiêu chí. Vui lòng thử lại sau.");
        }
    };


    return (

        <Modal>
            <ModalTrigger >
                <Button className="p-2 px-4 bg-blue-500 rounded-sm text-white"  >Chi tiết</Button>
            </ModalTrigger>

            <ModalBody className='min-h-[80%] max-h-[90%] md:max-w-[70%]'>

                <ModalContent>
                    <div className="flex flex-col h-[80vh]"> {/* Tổng chiều cao modal */}

                        {/* HEADER - 15% */}
                        <div className="basis-[10%] flex justify-center items-center ">
                            <h1 className="text-2xl md:text-3xl">Đơn tiêu chí</h1>
                        </div>

                        {/* INFO - 25% */}
                        <div className="basis-[20%] px-4 mt-3 flex flex-col gap-4 overflow-auto">
                            {/* Nội dung info giữ nguyên */}
                            <div className="flex items-center ">
                                <div className="w-20 flex items-center">
                                    <h3 className="text-nowrap"> Tiêu đề:</h3>
                                </div>
                                <div className="">{form?.data?.title}</div>
                            </div>
                            <div className="flex items-center ">
                                <div className="w-20 flex items-center">
                                    <h3 className="text-nowrap"> Người tạo: </h3>
                                </div>
                                <div className="">{form?.data?.createdBy}</div>
                            </div>
                            <div className="flex items-center ">
                                <div className="w-20 flex items-center">
                                    <h3 className="text-nowrap"> Ngày tạo: </h3>
                                </div>
                                <div className="">
                                    {form?.data?.createdDate
                                        ? new Date(form?.data?.createdDate).toLocaleString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : "Không có ngày "}
                                </div>
                            </div>
                        </div>

                        <div className="basis-[10%] flex items-center justify-between px-4 ">
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
                                {form?.data?.isDeleted == false && (<Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="px-6 py-2  hover:bg-orange-700"> <PlusCircle className='' />Thêm tiêu chí</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Lựa chọn câu hỏi</DialogTitle>
                                            <DialogDescription>
                                                Đây là nơi bạn chọn câu hỏi để thêm vào đơn.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Tiêu đề:
                                                </Label>
                                                <select
                                                    name="criteria"
                                                    id="criteria"
                                                    onChange={(e) => setValueQuestion(e.target.value)}
                                                    className="col-span-3 border p-2 rounded"
                                                    value={valueQuestion ?? ""}
                                                >
                                                    <option value="">-- Chọn câu hỏi --</option> {/* option này sẽ hiện đầu tiên */}
                                                    {criteriaIsExist && criteriaIsExist.length > 0 ? (
                                                        criteriaIsExist?.map((criteria, index) => (
                                                            <option key={criteria.id} value={criteria.id}>
                                                                {index + 1}. {criteria.question}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">Không có câu hỏi nào</option>
                                                    )}
                                                </select>

                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={() => handCreate()} >Thêm tiêu chí</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                )}

                            </div>
                        </div>
                        {/* CRITERIA - 60% */}
                        <div className="basis-[60%] overflow-auto p-2">
                            {(form?.data?.criteriaXCriteriaForms?.length && form?.data?.criteriaXCriteriaForms?.length > 0) ? (
                                <div className="bg-slate-50 border-2 rounded-sm  p-4 h-full overflow-auto">
                                    <Table className="min-w-full">
                                        <TableCaption>Danh sách các đơn sẵn có.</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">STT</TableHead>
                                                <TableHead>Ngày thêm</TableHead>
                                                <TableHead>Câu hỏi</TableHead>
                                                <TableHead>Thể loại</TableHead>
                                                <TableHead className="text-center">Hành động</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {form.data.criteriaXCriteriaForms.filter(x=>x.isDeleted==false).map((formXCriteria, index) => (
                                                <TableRow key={formXCriteria.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                        {formXCriteria.createdDate
                                                            ? new Date(formXCriteria.createdDate).toLocaleString("vi-VN", {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                            })
                                                            : "Không có ngày"}
                                                    </TableCell>
                                                    <TableCell>{formXCriteria?.criteria?.question}</TableCell>
                                                    <TableCell>
                                                        {formXCriteria?.criteria?.valueType === CriteriaValueType.Boolean
                                                            ? "Dạng đúng sai"
                                                            : "Dạng điền form"}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant={"destructive"}
                                                            onClick={() => handleDelete(formXCriteria.id ?? "")}
                                                        >
                                                            Xóa câu hỏi
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border-2 rounded-sm  h-full">
                                    <Table className="min-w-full">
                                        <TableCaption>
                                            Hiện tại chưa có tiêu chí nào.
                                            <br />
                                        </TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">STT</TableHead>
                                                <TableHead>Ngày thêm</TableHead>
                                                <TableHead>Tên câu hỏi</TableHead>
                                                <TableHead>Thể loại</TableHead>
                                                <TableHead className="text-center">Hành động</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                    </Table>

                                </div>
                            )}
                        </div>
                    </div>
                </ModalContent>



            </ModalBody>


        </Modal>
    )
}

export default DetailFormCriteria
