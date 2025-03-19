'use client'
import React, { useEffect, useState} from 'react';
import * as XLSX from "xlsx"
import { FileData } from './FileData';
import { InputFile } from './InputFile';
import {DataTable} from "@/app/(client)/(dashboard)/manage-review/import-csv/DataTable";
import {columnsFileCsv} from "@/app/(client)/(dashboard)/manage-review/import-csv/ColumsDef";
import {Button} from "@/components/ui/button";
import {Import} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AlertDialogImport() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className={"px-6 py-4 mt-6"} variant="default"><Import/> Save to Database</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure to import ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function Page() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<FileData[] | null>(null);
    const [header, setHeader] = useState<string[] | null>(null);
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

            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

            if (rows.length < 4) {
                console.error("Sheet does not contain enough rows.");
                return;
            }

            // Get headers from row 2 and row 3
            const headerRow1 = rows[1]
            const headerRow2 = rows[2]

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const filterHeader2 = headerRow2.filter(function (el) {
                return el != null;
            });


            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const headers = [...headerRow1, ...filterHeader2];

            // Data starts from row 4 (index 3)
            const dataRows = rows.slice(3); // Skip first 3 rows

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
    console.log(data);

    return (
        <div className={"flex justify-center items-center gap-1.5 px-8 py-2"}>
            {
                (data == null) && (header == null) ? (
                    <InputFile file={file} setFile={setFile} />
                ) : (
                    <div className="w-full">
                        <DataTable data={data!} columns={columnsFileCsv} />
                        <div className={""}>
                            <AlertDialogImport />
                        </div>
                    </div>
                )
            }
        </div>
    );
}

