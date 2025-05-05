'use client'
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import * as XLSX from "xlsx"
import {FileData} from './FileData';
import {InputFile} from './InputFile';
import {DataTable} from "@/app/(client)/(dashboard)/manage-review/import-csv/DataTable";
import {columnsFileCsv} from "@/app/(client)/(dashboard)/manage-review/import-csv/ColumsDef";
import {Button} from "@/components/ui/button";
import {ChevronRight, Import, Loader2} from "lucide-react";
import {ChevronDown} from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {reviewService} from "@/services/review-service";
import {semesterService} from "@/services/semester-service";
import {toast} from "sonner";
import {Semester} from "@/types/semester";
import {sheet2arr} from "@/lib/utils";
import { Label } from '@/components/ui/label';
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {ReviewExcelModels} from "@/types/review-excel-models";
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
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
export function DropdownReviewListMenu({review}: {
    review: string,
    setReview: Dispatch<React.SetStateAction<string>>
}) {
    return (
        <Breadcrumb className={"mb-4"}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    SPSE25
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight/>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    Review {review}
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}


function AlertDialogImport({loading, setLoading, callApiPostXLSXFunction, open, setOpen}:
                           {
                               loading: boolean,
                               setLoading: Dispatch<React.SetStateAction<boolean>>,
                               // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                               callApiPostXLSXFunction: Function,
                               open: boolean,
                               setOpen: Dispatch<React.SetStateAction<boolean>>,
                           }) {
    const handleClickContinueAction = async () => {
        setLoading(true)
        const response = await callApiPostXLSXFunction()
        if (response){
            setLoading(false)
        }
        setOpen(false)
    }
    const handleCancelClick =  () => {
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button onClick={() => {setOpen(true)}} className={"px-6 py-4 mt-6"} variant="default"><Import/>Xác nhận lưu</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bạn có chắc chắn những thông tin trên là chính xác ?</DialogTitle>
                    <DialogDescription>Hành động này không thể hoàn tác</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {
                        !loading
                            ? (<div className={"flex gap-2"}>
                                <Button variant={"outline"} onClick={() => {
                                    handleCancelClick()
                                }}>Huỷ</Button>
                                <Button onClick={() => {
                                    handleClickContinueAction()
                                }}>Tiếp tục</Button>
                            </div>)
                            : (<Button disabled>
                                <Loader2 className="animate-spin"/>
                                Please wait
                            </Button>)
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DialogFailReview({open, setOpen, reviewFails} :{open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, reviewFails: ReviewExcelModels[]}){
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Danh sách những đề tài chưa được thêm</DialogTitle>
                    <DialogDescription>
                        Vui lòng kiểm tra lại
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <Table>
                        <TableCaption>Danh sách những đề tài chưa được thêm và lý do.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">STT</TableHead>
                                <TableHead>Mã đề tài</TableHead>
                                <TableHead>Lý do</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviewFails.map((failReview) => (
                                <TableRow key={failReview.stt}>
                                    <TableCell className="font-medium">{failReview.stt}</TableCell>
                                    <TableCell>{failReview.topicCode}</TableCell>
                                    <TableCell>{failReview.reason}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Số lượng</TableCell>
                                <TableCell className="text-right">{reviewFails.length}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </DialogBody>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function Page() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<FileData[] | null>(null);
    const [header, setHeader] = useState<string[] | null>(null);
    const [review, setReview] = useState<string>("1")
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
    const [failReview, setFailReview] = useState<ReviewExcelModels[]>([])
    const [openFailReview, setOpenFailReview] = useState<boolean>(false)
    const postFileXLSX = async () => {
        if (currentSemester) {
            if (data?.length == 0) {
                toast.error("File không đúng format hoặc không tồn tại bất cứ record nào")
                return;
            }
            const result = await reviewService.importReviewFromXLSX(file!, parseInt(review), currentSemester.id!)
            console.log(result)
            if (result.status == -1) {
                toast.error(result.message)
            } else if (result.status == 1) {
                toast.success(result.message)
            }
            if (result.data && result.data.length > 0) {
                setFailReview(result.data)
                setOpenFailReview(true)
            }
        } else {
            toast.error("Không tìm thấy kì hiện tại")
        }
        setIsLoading(false)
    }
    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            if (!e.target?.result) return;

            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, {type: "array"});

            const sheetName = workbook.SheetNames[parseInt(review) - 1]; // Get first sheet
            const worksheet = workbook.Sheets[sheetName];
            const dataRowFilter = sheet2arr(worksheet)
            const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: false});
            // if (rows.length < 4) {
            //     console.error("Sheet does not contain enough rows.");
            //     return;
            // }

            // Get headers from row 2 and row 3
            const headerRow1 = rows[1]
            const headerRow2 = rows[2]

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const filterHeader2 = headerRow2.filter(function (el) {
                return el != null && el != "";
            });


            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const headers = [...headerRow1, ...filterHeader2];
            console.log(headers)
            // Data starts from row 4 (index 3)
            const dataRows = dataRowFilter.slice(3); // Skip first 3 rows
            console.log(dataRows)

            // Convert to structured JSON
            const formattedData = dataRows.map((row) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const obj: FileData = {};
                headers.forEach((header, index) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    obj[header] = row[index] || null; // Assign values
                });
                return obj;
            });
            setHeader(headers);
            setData(formattedData)
        };

        reader.onerror = (error) => console.error("File reading error:", error);
    }, [file]);
    useEffect(() => {
        const fetchData = async () => {
            const result = await semesterService.getCurrentSemester()
            if (result.data && result.status == 1) {
                setCurrentSemester(result.data)
            }
        }
        fetchData()
    }, []);

    return (
       <>
           {failReview.length > 0 && <DialogFailReview reviewFails={failReview} setOpen={setOpenFailReview} open={openFailReview} />}
           <div className={" items-center gap-1.5 px-8 py-2"}>
               <DropdownReviewListMenu setReview={setReview} review={review}/>
               {
                   (data == null) && (header == null) ? (
                       <div className={"w-full"}>
                           <div className={"flex flex-row gap-2 w-full justify-center items-center mb-8"}>
                               <Label className={"font-bold text-xl"}>Chọn giai đoạn: </Label>
                               <DropdownMenu>
                                   <DropdownMenuTrigger className="flex items-center gap-1">
                                       <div className={"text-red-500 text-lg"}>Review {review}</div>
                                       <ChevronDown className="h-4 w-4"/>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="start">
                                       <DropdownMenuLabel>Select review number</DropdownMenuLabel>
                                       <DropdownMenuRadioGroup value={review} onValueChange={setReview}>
                                           <DropdownMenuRadioItem value="1">Review 1</DropdownMenuRadioItem>
                                           <DropdownMenuRadioItem value="2">Review 2</DropdownMenuRadioItem>
                                           <DropdownMenuRadioItem value="3">Review 3</DropdownMenuRadioItem>
                                       </DropdownMenuRadioGroup>
                                   </DropdownMenuContent>
                               </DropdownMenu>
                           </div>
                           <div className={"w-full"}>
                               <InputFile file={file} setFile={setFile}/>
                           </div>
                       </div>
                   ) : (
                       <div className="w-full">
                           <div className={"flex flex-row gap-2 w-full justify-center items-center mb-8"}>
                               <Label className={"font-bold text-xl"}>Giai đoạn: </Label>
                               <div className={"text-red-500 text-lg"}>Review {review}</div>
                           </div>
                           <DataTable data={data!} columns={columnsFileCsv}/>
                           <div>
                               <AlertDialogImport
                                   callApiPostXLSXFunction={postFileXLSX}
                                   loading={isLoading}
                                   setLoading={setIsLoading}
                                   open={open}
                                   setOpen={setOpen}
                               />
                           </div>
                       </div>
                   )
               }
           </div>
       </>
    );
}

