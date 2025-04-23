'use client'
import React, {SetStateAction, Dispatch, useEffect, useState} from 'react';
import {capstoneService} from "@/services/capstone-service";
import { semesterService } from '@/services/semester-service';
import {Semester} from "@/types/semester";
import {CapstoneDefenseImportExcel} from "@/app/(client)/(dashboard)/manage-defense/import-file";
import * as XLSX from "xlsx";
import {
    CapstoneScheduleImportCommands
} from "@/types/models/commands/capstone-schedule/capstone-schedule-import-commands";
import {CapstoneScheduleTableImport} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-table-import";
import {
    capstoneScheduleColumn,
    capstoneScheduleSchemaColumns
} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-col-def";
import {CapstoneScheduleDialog} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-dialog";
import {toast} from "sonner";
import {CapstoneSchedule} from "@/types/capstone-schedule";
// import ChatMessage from "@/components/chat/ChatMessage";
import { Skeleton } from "@/components/ui/skeleton"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import { Button } from '@/components/ui/button';
import {sheet2arr} from "@/lib/utils";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {CapstoneScheduleExcelModels} from "@/types/capstone-schedule-excel-models";
import Link from 'next/link';

function DropdownSemester({semesters, currentSemester, setCurrentSemester}: {semesters: Semester[], currentSemester: Semester, setCurrentSemester: Dispatch<SetStateAction<Semester | undefined>>}) {
    if(!semesters) return;
    const dictionary: Record<string, Semester> = semesters.reduce(
        (acc, item) => {
            acc[item.id!] = item;
            return acc;
        },
        {} as Record<string, Semester>
    );

    const handleOnChange = (e: string) => {
        setCurrentSemester(dictionary[e])
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger value={currentSemester.id!}  className="flex items-center text-red-600 gap-1">
                {dictionary[currentSemester.id!].semesterCode} - {dictionary[currentSemester.id!].semesterName} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Chọn kì</DropdownMenuLabel>
                <DropdownMenuRadioGroup onValueChange={handleOnChange} >
                    {semesters.map(semester => (
                        <DropdownMenuRadioItem key={semester.semesterCode} value={semester.id!}>{semester.semesterCode} - {semester.semesterName}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function SelectStage({setStage, stage}: {setStage: Dispatch<SetStateAction<number>>, stage: number}) {
    return (
        <Select value={stage.toString()} onValueChange={(e)=> {setStage(parseInt(e))}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn giai đoạn" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Chọn giai đoạn</SelectLabel>
                    <SelectItem value="1">Lần 1</SelectItem>
                    <SelectItem value="2">Lần 2</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function SkeletonCard() {
    return (
        <div className="flex flex-col items-center justify-center space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

function DialogFailCapstoneSchedules({open, setOpen, capstoneScheduleFails} :{open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, capstoneScheduleFails: CapstoneScheduleExcelModels[]}){
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
                            {capstoneScheduleFails.map((failCapstone) => (
                                <TableRow key={failCapstone.stt}>
                                    <TableCell className="font-medium">{failCapstone.stt}</TableCell>
                                    <TableCell>{failCapstone.topicCode}</TableCell>
                                    <TableCell>{failCapstone.reason}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3}>Số lượng</TableCell>
                                <TableCell className="text-right">{capstoneScheduleFails.length}</TableCell>
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

const Page = () => {
    const [currentSemester, setCurrentSemester] = useState<Semester>();
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [capstoneScheduleData, setCapstoneScheduleData] = useState<CapstoneScheduleImportCommands[]>([]);
    const [capstoneSchedule, setCapstoneSchedule] = useState<CapstoneSchedule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [stage, setStage] = useState<number>(1)
    const [semesterPresent, setSemesterPresent] = useState<Semester>();
    const [open, setOpen] = useState<boolean>(false);
    const [failOpen, setFailOpen] = useState<boolean>(false);
    const [capstoneFails, setCapstoneFails] = useState<CapstoneScheduleExcelModels[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const fetch_current_semester = await semesterService.getCurrentSemester();
            const fetch_all_semester = await semesterService.getAll();
            if (fetch_all_semester.data && fetch_all_semester.data.results) {
                setSemesters(fetch_all_semester.data.results)
            }
            setCurrentSemester(fetch_current_semester.data)
            setSemesterPresent(fetch_current_semester.data)
        }
        fetchData()
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (currentSemester?.id) {
                const fetch_capstone_schedule = await capstoneService.getBySemesterAndStage({stage: stage, semesterId: currentSemester.id})

                if (fetch_capstone_schedule.status == 1 && fetch_capstone_schedule.data) {
                    setCapstoneSchedule(fetch_capstone_schedule.data)
                }
                if (fetch_capstone_schedule.status == -2) {
                    setCapstoneSchedule([])
                }
                setCapstoneScheduleData([])
                setFile(null)
                setLoading(false)
            }
        }
        fetchData()
    }, [currentSemester, stage]);
    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            if (!e.target?.result) return;

            const data = new Uint8Array(e.target.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0]; // Get first sheet
            const worksheet = workbook.Sheets[sheetName];
            const filterValue = sheet2arr(worksheet)

            const rows:string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

            const headers:string[] = rows[1]
            console.log(headers)
            const value = filterValue.slice(2)
            console.log(value)
            const formattedData: CapstoneScheduleImportCommands[] = value.map((row) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const obj: CapstoneScheduleImportCommands = {}
                headers.forEach((header, index) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    obj[header] = row[index] || null; // Assign values
                });
                return obj;
            });
            console.log(formattedData)
            // const data = rows
            setCapstoneScheduleData(formattedData)
        }
    }, [file]);

    const handleSaveChange = async () => {
        if (file) {
            const result = await capstoneService.importExcelFile({file, stage: stage})
            if (result.status == 1) {
                toast.success("Import successfully imported!");
                setOpen(false);
            }
            if (result.data) {
                setCapstoneFails(result.data);
                setFailOpen(true);
            }
            else {
                toast.error(result.message);
                setOpen(false)
            }
        }
    }

    return !loading ? (
        <div>

            {capstoneFails.length > 0 && <DialogFailCapstoneSchedules capstoneScheduleFails={capstoneFails} open={failOpen} setOpen={setFailOpen} />}
            {currentSemester && capstoneSchedule.length == 0 ? (
                <div className={"font-bold text-xl flex flex-col items-center justify-center"}>
                    <div className={"flex flex-col items-center justify-center"}>
                        <div className={"flex flex-row gap-2"}>
                            <div>
                                Kì
                                {/*<span className={"text-red-600 px-0.5"}> {currentSemester.semesterCode} - {currentSemester.semesterName} </span>*/}
                                {/*vẫn chưa được thêm lịch bảo vệ.*/}
                            </div>
                            {semesters.length >0 && currentSemester &&  <DropdownSemester currentSemester={currentSemester} setCurrentSemester={setCurrentSemester} semesters={semesters} />}
                            <div>vẫn chưa được thêm lịch bảo vệ.</div>
                        </div>
                        <div className={"pb-4"}>
                            Bạn có thể nhập lịch bảo vệ tại đây.
                        </div>
                    </div>
                    <SelectStage stage={stage} setStage={setStage} />
                    <Button variant={"default"} className={"my-4"}  onClick={() => {
                        const filePath = `${process.env.NEXT_PUBLIC_API_BASE}/api/projects/export-excel/${stage}`
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        window.location = filePath
                    }}>Tải mẫu bảo vệ lần {stage} tại đây!</Button>
                    {currentSemester.id == semesterPresent?.id ?  <CapstoneDefenseImportExcel file={file} setFile={setFile} /> : (
                        <div className={"mt-16"}>Bạn không thể import tại kì này. Vui lòng liên hệ để biết thêm chi tiết</div>
                    )}
                    {capstoneScheduleData.length > 0 && (
                        <div className={"w-full flex flex-col items-center justify-center gap-4"}>
                            <CapstoneScheduleTableImport columns={capstoneScheduleColumn} data={capstoneScheduleData} />
                            <CapstoneScheduleDialog open={open} setOpen={setOpen} handleSaveChange={handleSaveChange} />
                        </div>
                    )}
                </div>
            ): (
                <div className={"font-bold text-xl flex flex-col items-center gap-4 justify-center"}>
                    {
                        currentSemester && (
                           <>
                               <div className={"flex flex-row gap-2"}>
                                   <div>
                                       Lịch bảo vệ kì
                                   </div>
                                   <DropdownSemester currentSemester={currentSemester} setCurrentSemester={setCurrentSemester} semesters={semesters} />
                               </div>
                               <SelectStage stage={stage} setStage={setStage} />
                           </>
                        )
                    }
                    {

                        capstoneSchedule.length && (
                            <>
                                <Button className={"self-start ml-10"} asChild>
                                    <Link href={"manage-defense/import-defense"}>Import danh sách bảo vệ</Link>
                                </Button>
                                <CapstoneScheduleTableImport columns={capstoneScheduleSchemaColumns} data={capstoneSchedule} />
                            </>
                        )
                    }
                </div>
            )}

        </div>
    ) : (
        <div className={"flex justify-center gap-4"}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );
};

export default Page;