import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, {Dispatch, SetStateAction} from "react";
import {Loader2} from "lucide-react";

export function CapstoneScheduleDialog({handleSaveChange, open, setOpen, loading}: {loading: boolean, handleSaveChange: Function, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={"self-end mr-6"} variant="default">Lưu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nhập lịch bảo vệ</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    Bạn có chắc các thông tin đã chính xác.<br/> Hành động này sẽ không thể hoàn tác.
                </div>
                <DialogFooter>
                    {loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Đang xử lí
                        </Button>
                        : <Button onClick={() => {handleSaveChange()}} type="submit">Xác nhận</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
