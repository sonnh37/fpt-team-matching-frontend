'use client'
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {CapstoneDefenseImportExcel} from "@/app/(client)/(dashboard)/manage-defense/import-file";
import {CapstoneScheduleTableImport} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-table-import";
import {
    capstoneScheduleColumn,
} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-col-def";
import {CapstoneScheduleDialog} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-dialog";
import {Semester} from "@/types/semester";
import {
    CapstoneScheduleImportCommands
} from "@/types/models/commands/capstone-schedule/capstone-schedule-import-commands";
import {CapstoneScheduleExcelModels} from "@/types/capstone-schedule-excel-models";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
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
import {semesterService} from "@/services/semester-service";
import {capstoneService} from "@/services/capstone-service";
import * as XLSX from "xlsx";
import {sheet2arr} from "@/lib/utils";
import {toast} from "sonner";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {projectService} from "@/services/project-service";
import { Project } from '@/types/project';
import {
    UpdateCapstoneScheduleDialog
} from "@/app/(client)/(dashboard)/manage-defense/import-defense/update-capstone-schedule-dialog";
import {
    CreateCapstoneScheduleDialog
} from "@/app/(client)/(dashboard)/manage-defense/import-defense/create-capstone-schedule-dialog";
import {CapstoneSchedule} from "@/types/capstone-schedule";



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
    const [stage, setStage] = useState<number>(1)
    const [semesterPresent, setSemesterPresent] = useState<Semester>();
    const [open, setOpen] = useState<boolean>(false);
    const [failOpen, setFailOpen] = useState<boolean>(false);
    const [capstoneFails, setCapstoneFails] = useState<CapstoneScheduleExcelModels[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setselectedProjectIdId] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [createIsOpen, setCreateIsOpen] = useState<boolean>(false);
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
    useEffect(() => {
        const fetchData = async () => {
            if (!currentSemester)
                return;
            const response = await projectService.getProjectBySemesterAndStage({semester: currentSemester.id!, stage})
            if (response.data) {
                setProjects(response.data);
            }
        }
        if (currentSemester) {
            fetchData()
        }
    }, [currentSemester, stage])
    useEffect(() => {
        if (!selectedProjectId) return;

        const updatedProjects = [...projects];
        const projectIndex = updatedProjects.findIndex(p => p.id === selectedProjectId);
        if (projectIndex === -1) return;

        const project = { ...updatedProjects[projectIndex] };
        project.capstoneSchedules = [...project.capstoneSchedules];

        if (project.capstoneSchedules.length === 0) {
            project.capstoneSchedules.push({
                projectId: project.id!,
                stage: stage,
                time: "",
                hallName: "",
                date: ""
            } as CapstoneSchedule);
        }

        if (!project.capstoneSchedules.some(x => x.stage === stage)) {
            project.capstoneSchedules.push({
                projectId: project.id!,
                stage: stage,
                time: "",
                hallName: "",
                date: ""
            } as CapstoneSchedule);
        }

        setSelectedProject(project);
    }, [selectedProjectId, projects, stage]);

    const handleSaveChange = async () => {
        if (file) {
            const result = await capstoneService.importExcelFile({file, stage: stage})
            if (result.status == 1) {
                toast.success("Cập nhật thành công!");
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
    const handleSaveChangeManual = async () => {
        try {
            //1. set loading
            setLoading(true)
            const selectedCapstoneSche = selectedProject?.capstoneSchedules.filter(x => x.stage == stage)[0]
            if (!selectedCapstoneSche){
                toast.error("Không tìm thấy capstone")
                return;
            }
            if (!selectedCapstoneSche.time || !selectedCapstoneSche.projectId || !selectedCapstoneSche.hallName || !selectedCapstoneSche.date) {
                toast.error("Vui lòng điền đầy đủ các field cần thiết")
                return;
            }
            const result = await capstoneService.updateCapstoneSchedule({
                stage: stage,
                time: selectedCapstoneSche.time,
                projectId: selectedCapstoneSche.projectId,
                id: selectedCapstoneSche.id,
                hallName: selectedCapstoneSche.hallName,
                date: selectedCapstoneSche.date
            })
            if (result.status == -1) {
                toast.error(result.message)
            }
            toast.success(result.message);

        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.message);
        }
        setLoading(false)
        setIsOpen(false)
    }

    const handleSaveChangeCreateManual = async () => {
        try {
            //1. set loading
            setCreateLoading(true)
            const selectedCapstoneSche = selectedProject?.capstoneSchedules.filter(x => x.stage == stage)[0]
            if (!selectedCapstoneSche){
                toast.error("Không tìm thấy capstone")
                setCreateLoading(false)
                setCreateIsOpen(false)
                return;
            }
            if (!selectedCapstoneSche.time?.trim() || !selectedCapstoneSche.projectId?.trim() || !selectedCapstoneSche.hallName?.trim() || !selectedCapstoneSche.date?.trim()) {
                toast.error("Vui lòng điền đầy đủ các field cần thiết")
                setCreateLoading(false)
                setCreateIsOpen(false)
                return;
            }
            const result = await capstoneService.createCapstoneSchedule({
                stage: stage,
                time: selectedCapstoneSche.time,
                projectId: selectedCapstoneSche.projectId,
                hallName: selectedCapstoneSche.hallName,
                date: selectedCapstoneSche.date
            })
            if (result.status == -1) {
                toast.error(result.message)
                return;
            }
            toast.success(result.message);

        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.message);
        }
        finally {
            setCreateLoading(false)
            setCreateIsOpen(false)
        }
    }
    return  (
        <div>
            {capstoneFails.length > 0 && <DialogFailCapstoneSchedules capstoneScheduleFails={capstoneFails} open={failOpen} setOpen={setFailOpen} />}
                <div className={"font-bold text-xl flex flex-col items-center justify-center"}>
                    <div className={"flex flex-col items-center justify-center"}>
                        <div className={"flex flex-row gap-2"}>
                            <div>
                                Kì
                            </div>
                            {semesters.length >0 && currentSemester &&  <DropdownSemester currentSemester={currentSemester} setCurrentSemester={setCurrentSemester} semesters={semesters} />}
                            {/*<div>vẫn chưa được thêm lịch bảo vệ.</div>*/}
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
                    {currentSemester && currentSemester.id == semesterPresent?.id ?
                        (
                            <Tabs defaultValue="import-csv" className="w-full">
                                <Card>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="import-csv">Import bằng excel</TabsTrigger>
                                        <TabsTrigger value="import-manual">Import từng đề tài</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="import-csv" className={"flex flex-col items-center justify-center my-8"}>
                                        <CapstoneDefenseImportExcel file={file} setFile={setFile} />
                                        {capstoneScheduleData.length > 0 && (
                                            <div className={"w-full flex flex-col items-center justify-center gap-4"}>
                                                <CapstoneScheduleTableImport columns={capstoneScheduleColumn} data={capstoneScheduleData} />
                                                <CapstoneScheduleDialog open={open} setOpen={setOpen} handleSaveChange={handleSaveChange} />
                                            </div>
                                        )}
                                    </TabsContent>
                                    <TabsContent value="import-manual">
                                        <CardContent className="flex justify-between gap-4">
                                            <div className={"w-[65%] p-8 pr-16 border-r-[1px] border-gray-300"}>
                                                <div className={"mb-6"}>
                                                    <div>
                                                        Thông tin về đề tài
                                                    </div>
                                                </div>
                                                <div className={"flex flex-col gap-2"}>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="current">Mã đề tài</Label>
                                                        <Select onValueChange={(e) => {setselectedProjectIdId(e)}}>
                                                            <SelectTrigger className="w-[20vw]">
                                                                <SelectValue placeholder="Chọn mã đề tài" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Mã đề tài</SelectLabel>
                                                                    {projects.length > 0 && projects.map((project) => (
                                                                        <SelectItem key={project.topic?.topicCode} value={project.id!}>{project.topic?.topicCode}</SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="new">Tên đề tài tiếng anh</Label>
                                                        <Input disabled={true} value={projects.filter(x => x.id == selectedProjectId) ? projects.filter(x => x.id == selectedProjectId)[0]?.topic?.ideaVersion?.englishName : undefined} />
                                                    </div>
                                                    {projects.filter(x => x.id == selectedProjectId)[0]?.topic?.ideaVersion?.enterpriseName ?
                                                        <div className="space-y-1">
                                                            <Label htmlFor="new">Tên đề tài doanh nghiệp</Label>
                                                            <Input disabled={true} value={projects.filter(x => x.id == selectedProjectId) ? projects.filter(x => x.id == selectedProjectId)[0]?.topic?.ideaVersion?.enterpriseName : undefined} />
                                                        </div>
                                                     : <div className="space-y-1">
                                                            <Label htmlFor="new">Đề tài doanh nghiệp</Label>
                                                            <Input disabled={true} value={"N/A"} />
                                                        </div>}
                                                    <div className="space-y-1">
                                                        <Label htmlFor="new">Tên nhóm</Label>
                                                        <Input disabled={true} value={projects.filter(x => x.id == selectedProjectId) ? projects.filter(x => x.id == selectedProjectId)[0]?.teamName : undefined} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="new">Số lượng thành viên</Label>
                                                        <Input disabled={true} value={projects.filter(x => x.id == selectedProjectId) ? projects.filter(x => x.id == selectedProjectId)[0]?.teamSize : undefined} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"w-[30%] py-8"}>
                                                <div className={"mb-6"}>
                                                    <div>Cập nhật thông tin bảo vệ đồ án</div>
                                                </div>
                                                <div className={"flex flex-col gap-2"}>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="current">Ngày bảo vệ</Label>
                                                        <Input
                                                            className={"flex justify-between"}
                                                            type="date"
                                                            value={
                                                                selectedProject &&
                                                                selectedProject.capstoneSchedules?.find(x => x.projectId === selectedProjectId && x.stage === stage)?.date
                                                                    ? new Date(
                                                                        new Date(selectedProject.capstoneSchedules.find(x => x.projectId === selectedProjectId && x.stage === stage)!.date!).getTime() +
                                                                        7 * 60 * 60 * 1000
                                                                    ).toISOString().substring(0, 10)
                                                                    : ""
                                                            }
                                                            onChange={(e) => {
                                                                if (!selectedProject)
                                                                    return;

                                                                const newDateStr = e.target.value; // format: yyyy-MM-dd
                                                                console.log(newDateStr);
                                                                const updatedSchedules = selectedProject.capstoneSchedules?.map(schedule => {
                                                                    if (schedule.projectId === selectedProjectId && schedule.stage === stage) {
                                                                        return {
                                                                            ...schedule,
                                                                            date: new Date(newDateStr).toISOString() // or keep as Date object depending on your backend
                                                                        };
                                                                    }
                                                                    return schedule;
                                                                });

                                                                setSelectedProject(prev => ({
                                                                    ...prev!,
                                                                    capstoneSchedules: updatedSchedules
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-1 my-4">
                                                        {/*Time picker*/}
                                                        <form className="max-w-[16rem]  grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label htmlFor="start-time"
                                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start
                                                                    time:</label>
                                                                <div className="relative">
                                                                    <div
                                                                        className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                                        <svg
                                                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="currentColor" viewBox="0 0 24 24">
                                                                            <path fillRule="evenodd"
                                                                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                                                  clipRule="evenodd"/>
                                                                        </svg>
                                                                    </div>
                                                                    <input
                                                                        type="time"
                                                                        id="start-time"
                                                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                        min="09:00"
                                                                        max="18:00"
                                                                        value={
                                                                            selectedProject &&
                                                                            selectedProject.capstoneSchedules?.find(x => x.stage === stage)?.time?.split(/\s*-\s*/)[0] || ""
                                                                        }
                                                                        required
                                                                        onChange={(e) => {
                                                                            const newStartTime = e.target.value;

                                                                            setSelectedProject(prev => {
                                                                                if (!prev) return prev;

                                                                                const updatedSchedules = prev.capstoneSchedules.map(schedule => {
                                                                                    if (schedule.stage === stage) {
                                                                                        const existingTime = schedule.time || "00:00";
                                                                                        const endTime = existingTime.split(/\s*-\s*/)[1] || "00:00";
                                                                                        return {
                                                                                            ...schedule,
                                                                                            time: `${newStartTime} - ${endTime}`
                                                                                        };
                                                                                    }
                                                                                    return schedule;
                                                                                });

                                                                                return {
                                                                                    ...prev,
                                                                                    capstoneSchedules: updatedSchedules
                                                                                };
                                                                            });
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label htmlFor="end-time"
                                                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End
                                                                    time:</label>
                                                                <div className="relative">
                                                                    <div
                                                                        className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                                        <svg
                                                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                                            aria-hidden="true"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="currentColor" viewBox="0 0 24 24">
                                                                            <path fillRule="evenodd"
                                                                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                                                  clipRule="evenodd"/>
                                                                        </svg>
                                                                    </div>
                                                                    <input type="time" id="end-time"
                                                                           className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                           min="09:00" max="18:00"
                                                                           value={
                                                                               selectedProject &&
                                                                               selectedProject.capstoneSchedules?.find(x => x.stage === stage)?.time?.split(/\s*-\s*/)[1] || ""
                                                                           }
                                                                           required
                                                                           onChange={(e) => {
                                                                               const newEndTime = e.target.value;

                                                                               setSelectedProject(prev => {
                                                                                   console.log(prev)
                                                                                   if (!prev) return prev;

                                                                                   const updatedSchedules = prev.capstoneSchedules.map(schedule => {
                                                                                       if (schedule.stage === stage) {
                                                                                           const existingTime = schedule.time || "00:00";
                                                                                           const startTime = existingTime.split(/\s*-\s*/)[0] || "00:00";
                                                                                           return {
                                                                                               ...schedule,
                                                                                               time: `${startTime} - ${newEndTime}`
                                                                                           };
                                                                                       }
                                                                                       return schedule;
                                                                                   });

                                                                                   return {
                                                                                       ...prev,
                                                                                       capstoneSchedules: updatedSchedules
                                                                                   };
                                                                               });
                                                                           }}
                                                                           />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="current">Phòng</Label>
                                                        <Input
                                                            onChange={(e) => {
                                                                if (!selectedProject)
                                                                    return;
                                                                const newRoom = e.target.value;
                                                                const updatedSchedules = selectedProject.capstoneSchedules?.map(schedule => {
                                                                    if (schedule.projectId === selectedProjectId && schedule.stage === stage) {
                                                                        return {
                                                                            ...schedule,
                                                                            hallName: newRoom
                                                                        };
                                                                    }
                                                                    return schedule;
                                                                });

                                                                setSelectedProject(prev => ({
                                                                    ...prev!,
                                                                    capstoneSchedules: updatedSchedules
                                                                }));
                                                            }}
                                                            value={selectedProject && selectedProject.capstoneSchedules?.filter(x => x.projectId == selectedProjectId && x.stage == stage)[0]?.hallName
                                                                ? selectedProject.capstoneSchedules?.filter(x => x.projectId == selectedProjectId && x.stage == stage)[0]?.hallName
                                                                : undefined}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className={"float-end mt-8"}>
                                            {selectedProject == null ? <div></div>  : selectedProject.capstoneSchedules.filter(x => x.stage == stage)[0].id ? (
                                                // <Button className={"w-[20vw]"}>Chỉnh sửa lịch bảo vệ đồ án</Button>
                                                <UpdateCapstoneScheduleDialog loading={loading} handleSaveChange={handleSaveChangeManual} setIsOpen={setIsOpen} isOpen={isOpen}  />
                                            ): (
                                                // <Button className={"w-[20vw]"}>Tạo mới lịch bảo vệ đồ án</Button>
                                                <CreateCapstoneScheduleDialog isOpen={createIsOpen} setIsOpen={setCreateIsOpen} handleSaveChange={handleSaveChangeCreateManual} loading={createLoading} />
                                            )}
                                        </CardFooter>
                                    </TabsContent>
                                </Card>
                            </Tabs>

                        )
                        :
                        (<div className={"mt-16"}>Bạn không thể import tại kì này. Vui lòng liên hệ để biết thêm chi
                            tiết</div>)
                    }

                </div>
        </div>
    );
};

export default Page;