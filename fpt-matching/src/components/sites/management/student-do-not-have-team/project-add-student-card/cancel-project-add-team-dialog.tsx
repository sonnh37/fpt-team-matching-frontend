import { Button } from "@/components/ui/button"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export function CancelProjectAddTeamDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Huỷ</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Huỷ nhóm</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn huỷ nhóm này ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => {
                        window.location.reload()
                    }}  type="submit">Xác nhận huỷ</Button>
                <DialogClose>
                    <Button variant={"outline"} type="submit">Quay lại</Button>
                </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
