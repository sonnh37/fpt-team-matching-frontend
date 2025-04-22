import { Button } from "@/components/ui/button"
import {AlertDialog, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import React, {Dispatch, SetStateAction} from "react";
import {Loader2} from "lucide-react";


export function CreateCapstoneScheduleDialog(
    {isOpen, setIsOpen, handleSaveChange, loading} :
    {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, handleSaveChange: Function, loading: boolean}
) {

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                <Button className={"mb-8 w-[20vw]"} onClick={() => {setIsOpen(true)}} variant="destructive">Tạo mới lịch bảo vệ đồ án</Button>
            </AlertDialogTrigger>
            <AlertDialogContent  className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Tạo lịch bảo vệ đồ án</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc đây là thông tin đã nhập? Vui lòng kiểm tra lại trước khi nộp
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {!loading ? <Button onClick={() => {handleSaveChange()}} variant={"destructive"} type="submit">Tiếp tục</Button>
                        : (
                            <Button disabled>
                                <Loader2 className="animate-spin" />
                                Please wait
                            </Button>
                        )}
                    <AlertDialogCancel onClick={() => {setIsOpen(false)}} className={"bg-amber-600"}>Huỷ</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
