import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Loader2, Paperclip} from "lucide-react";
import * as XLSX from "xlsx";
import {sheet2arr} from "@/lib/utils";
import ImportUserModels from "@/types/models/import-user-models";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {ImportUserColDef} from "@/components/sites/management/import-user/import-user-col-def";
import {User} from "@/types/user";
import {toast} from "sonner";
import {userService} from "@/services/user-service";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import DialogConfirmUpdate from "@/components/sites/management/import-user/dialog-confirm-update";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

function DataTableUserImport<TData, TValue>({
                                             columns,
                                             data,
                                         }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Không có kết quả.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}


function ImportManyCardDialog({handleSaveChange, loading, open, setOpen}: {handleSaveChange: Function, loading: boolean, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className={"self-end mr-6"} variant="default">Tạo tài khoản</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    Bạn có chắc các thông tin đã chính xác.<br/> Hành động này sẽ không thể hoàn tác.
                </div>
                <DialogFooter>
                    {loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Đang xử lí
                        </Button> :
                        <Button onClick={() => {
                            handleSaveChange()
                        }} type="submit">Xác nhận</Button>

                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
const ImportManyCard = ({role, semesterId}: {role: string,semesterId: string | null}) => {
    const [file, setFile] = React.useState<File | null>(null);
    const [importUsers, setImportUsers] = React.useState<ImportUserModels[]>([])
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [usersConfirm, setUsersConfirm] = React.useState<User[]>([]);
    useEffect(() => {
        if (!file)
            return;
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
            const value = filterValue.slice(2)
            const formattedData: ImportUserModels[] = value.map((row) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const obj: ImportUserModels = {}
                headers.forEach((header, index) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    obj[header] = row[index] || null; // Assign values
                });
                return obj;
            });
            console.log(formattedData)
            setImportUsers(formattedData)
            // const data = rows
            // setCapstoneScheduleData(formattedData)
        }
    }, [file]);

    const handleSaveChange = async () => {
        setLoading(true);
        if (
           !file
        ) {
            setLoading(false)
            toast.error("Vui lòng điền đầy đủ tất cả các thông tin")
            return;
        }
        let response;
        if (role == "Student") {
            if (semesterId == null) {
                toast.error("Kì hiện tại đang không tồn tại")
                return;
            }
            response = await userService.createManyStudentByManager(file, semesterId);
            if (response.status == -1) {
                setOpen(false);
                toast.error(response.message)
                setLoading(false)
                return;
            }
            if (response.status == 2) {
                if (response.data) {
                    toast.success("Cập nhật thành công")
                    toast.info(response.message)
                    setUsersConfirm(response.data)
                    setOpenConfirmDialog(true)
                    setLoading(false)
                }
                return;
            }
            if (response.status == 3) {
                if (response.data) {
                    toast.info(response.message)
                    setLoading(false)
                    setUsersConfirm(response.data)
                    setOpenConfirmDialog(true)
                }
                return;
            }
            setLoading(false)
            setOpen(false)
            toast.success(response.message)
        }
        if (role == "Lecturers") {
            response = await userService.createManyLecturersByManager(file);
            if (response.status == -1) {
                setOpen(false);
                toast.error(response.message)
                setLoading(false)
                return;
            }
            if (response.status == 2) {
                if (response.data) {
                    toast.success("Cập nhật thành công")
                    toast.info(response.message)
                    setUsersConfirm(response.data)
                    setOpenConfirmDialog(true)
                    setLoading(false)
                }
                return;
            }
            if (response.status == 3) {
                if (response.data) {
                    toast.info(response.message)
                    setLoading(false)
                    setUsersConfirm(response.data)
                    setOpenConfirmDialog(true)
                }
                return;
            }
            setLoading(false)
            setOpen(false)
            toast.success(response.message)
        }
    }
    return (
        <>
            {usersConfirm.length > 0 && <DialogConfirmUpdate role={role} semesterId={semesterId} usersConfirm={usersConfirm} open={openConfirmDialog} setOpen={setOpenConfirmDialog} />}
            <Card>
                <CardHeader className={"flex justify-center items-center"}>
                    <CardTitle>Thêm danh sách tài khoản mới</CardTitle>
                </CardHeader>
                <div className={"flex justify-center items-center pb-4"}>
                    <div>Sử dụng file excel mẫu</div>
                    <Link
                        className="px-1.5 font-bold text-red-500"
                        download="ImportUser.xlsx"
                        href="/ImportUser.xlsx"
                    >tại đây
                    </Link>
                    <div>  để thêm danh sách tài khoản mới</div>
                </div>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        {file == null ? (
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file"
                                           className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                                className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Import your review file with template</p>
                                        </div>
                                        <input onChange={(e) => {
                                            if (e.target.files) {
                                                setFile(e.target.files[0]);
                                            }
                                        }} id="dropzone-file" type="file" className="hidden"/>
                                    </label>
                                </div>
                            ) :
                            <div>
                                <div className={"w-full flex flex-row justify-center items-center"}>
                                    <div className={"flex gap-2 my-4"}><Paperclip />{file!.name}</div>
                                </div>
                                {importUsers.length >0 && <DataTableUserImport data={importUsers} columns={ImportUserColDef} />}
                            </div>
                        }
                    </div>
                </CardContent>
                <CardFooter>
                    {file && <ImportManyCardDialog open={open} setOpen={setOpen} loading={loading} handleSaveChange={handleSaveChange} />}
                </CardFooter>
            </Card>
        </>
    );
};

export default ImportManyCard;