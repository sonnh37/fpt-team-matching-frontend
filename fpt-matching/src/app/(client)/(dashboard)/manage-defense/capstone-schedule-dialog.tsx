import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function CapstoneScheduleDialog({handleSaveChange}: {handleSaveChange: Function}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"self-end mr-6"} variant="default">Lưu</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import capstone schedule</DialogTitle>
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
