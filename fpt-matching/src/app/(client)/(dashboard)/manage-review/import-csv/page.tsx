'use client'
import React, {Dispatch, useEffect, useState} from 'react';
import * as XLSX from "xlsx"
import { FileData } from './FileData';
import { InputFile } from './InputFile';
import {DataTable} from "@/app/(client)/(dashboard)/manage-review/import-csv/DataTable";
import {columnsFileCsv} from "@/app/(client)/(dashboard)/manage-review/import-csv/ColumsDef";
import {Button} from "@/components/ui/button";
import {ChevronRight, Import, Loader2} from "lucide-react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChevronDown } from "lucide-react"

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
import {Toast} from "@/components/ui/toast";

export function DropdownReviewListMenu({review, setReview} : {review: string, setReview: Dispatch<React.SetStateAction<string>>}) {
    return (
        <Breadcrumb className={"mb-4"}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    SPSE25
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <ChevronRight />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                            Review {review}
                            <ChevronDown className="h-4 w-4" />
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
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}


function AlertDialogImport({loading, setLoading, callApiPostXLSXFunction, open, setOpen}:
                           {
                               loading: boolean,
                               setLoading: Dispatch<React.SetStateAction<boolean>>,
                               callApiPostXLSXFunction: Function,
                               open: boolean,
                               setOpen: Dispatch<React.SetStateAction<boolean>>,
                           }) {
    const handleClickContinueAction = async () => {
        setLoading(true)
        await callApiPostXLSXFunction()
        setOpen(false)
    }
    return (
        <AlertDialog open={open}>
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
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    {
                        !loading
                            ? ( <Button onClick={() => {handleClickContinueAction()}}>Continue</Button>)
                            : ( <Button disabled>
                                <Loader2 className="animate-spin" />
                                Please wait
                            </Button>)
                    }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default function Page() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<FileData[] | null>(null);
    const [header, setHeader] = useState<string[] | null>(null);
    const [review, setReview] = useState<string>("1")
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = React.useState<boolean>(false);

    const postFileXLSX = async () => {
        const result = await reviewService.importReviewFromXLSX(file!, parseInt(review), "ab61a0c5-4cef-455f-8903-e32ffa05861e")
        console.log(result)
        if (result.status == -1) {

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

    return (
        <div className={" items-center gap-1.5 px-8 py-2"}>
            <DropdownReviewListMenu setReview={setReview} review={review} />
            {
                (data == null) && (header == null) ? (
                    <div className={"w-full"}>
                        <InputFile file={file} setFile={setFile} />
                    </div>
                ) : (
                    <div className="w-full">
                        <DataTable data={data!} columns={columnsFileCsv} />
                        <div onClick={() => {setOpen(true)}}>
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
    );
}

