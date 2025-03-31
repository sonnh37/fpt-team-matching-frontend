'use client'
import React, {useEffect, useState} from 'react';
import {capstoneService} from "@/services/capstone-service";
import { semesterService } from '@/services/semester-service';
import {Semester} from "@/types/semester";
import {CapstoneDefenseImportExcel} from "@/app/(client)/(dashboard)/manage-defense/import-file";
import * as XLSX from "xlsx";
import {
    CapstoneScheduleImportCommands
} from "@/types/models/commands/capstone-schedule/capstone-schedule-import-commands";
import {CapstoneScheduleTable} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-table";
import {capstoneScheduleColumn} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-col-def";
import { Button } from '@/components/ui/button';
import {CapstoneScheduleDialog} from "@/app/(client)/(dashboard)/manage-defense/capstone-schedule-dialog";
import {toast} from "sonner";
import {CapstoneSchedule} from "@/types/capstone-schedule";
// import ChatMessage from "@/components/chat/ChatMessage";

const Page = () => {
    const [currentSemester, setCurrentSemester] = useState<Semester>();
    const [file, setFile] = useState<File | null>(null);
    const [capstoneScheduleData, setCapstoneScheduleData] = useState<CapstoneScheduleImportCommands[]>([]);
    const [capstoneSchedule, setCapstoneSchedule] = useState<CapstoneSchedule[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const fetch_current_semester = await semesterService.getCurrentSemester();
            setCurrentSemester(fetch_current_semester.data)
        }
        fetchData()
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            if (currentSemester?.id) {
                const fetch_capstone_schedule = await capstoneService.getBySemesterAndStage({stage: 1, semesterId: currentSemester.id})
                if (fetch_capstone_schedule.status == 1 && fetch_capstone_schedule.data) {
                    setCapstoneSchedule(fetch_capstone_schedule.data)
                }
            }
        }
        fetchData()
    }, [currentSemester]);
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

            const rows:string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

            const headers:string[] = rows[1]
            const value = rows.slice(2)
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
            // const data = rows
            setCapstoneScheduleData(formattedData)
        }
    }, [file]);

    const handleSaveChange = async () => {
        if (file) {
            const result = await capstoneService.importExcelFile({file, stage: 1})
            if (result.status == 1) {
                toast.success("Import successfully imported!");
            } else {
                toast.error(result.message);
            }
        }
    }
    return (
        <div>
            {currentSemester && capstoneSchedule.length == 0 ? (
                <div className={"font-bold text-xl flex flex-col items-center justify-center"}>
                    <div>
                        Kì <span className={"text-red-600 px-0.5"}> {currentSemester.semesterCode} - {currentSemester.semesterName} </span> vẫn chưa được thêm lịch bảo vệ.
                    </div>
                    <div>
                        Bạn có thể nhập lịch bảo vệ tại đây.
                    </div>
                    <CapstoneDefenseImportExcel file={file} setFile={setFile} />
                    {capstoneScheduleData.length > 0 && (
                        <div className={"w-full flex flex-col items-center justify-center gap-4"}>
                            <CapstoneScheduleTable data={capstoneScheduleData} columns={capstoneScheduleColumn} />
                            <CapstoneScheduleDialog handleSaveChange={handleSaveChange} />
                        </div>
                    )}
                </div>
            ): (
                <div className={"font-bold text-xl flex flex-col items-center justify-center"}>
                    Existed
                </div>
            )}
        </div>
    );
};

export default Page;