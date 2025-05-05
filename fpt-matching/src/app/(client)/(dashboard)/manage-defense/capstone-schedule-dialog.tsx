import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Dispatch, SetStateAction} from "react";

export function CapstoneScheduleDialog({handleSaveChange, open, setOpen}: {handleSaveChange: Function, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
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
                    <Button onClick={() => {handleSaveChange()}} type="submit">Xác nhận</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
