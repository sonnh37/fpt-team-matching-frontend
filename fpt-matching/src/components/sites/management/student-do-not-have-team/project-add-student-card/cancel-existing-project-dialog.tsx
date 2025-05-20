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
import {projectService} from "@/services/project-service";
import {toast} from "sonner";
import React, {useState} from "react";
import {Loader2} from "lucide-react";


export function CancelExistingProjectDialog({projectId} : {projectId: string}) {
    const [loading, setLoading] = useState(false);
    const handleCancelProject = async () => {
        try {
            setLoading(true);
            const response = await projectService.cancelProjectByManager({projectId})
            if (response.status != 1) {
                toast.error(response.message)
                return;
            } else {

                toast.success(response.message)
                window.location.reload()
            }
        } catch (error: any) {
            toast.error(error.message)
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Huỷ nhóm</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Huỷ nhóm</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn huỷ nhóm này ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Đang xử lí
                        </Button> :
                        <Button onClick={() => {
                            handleCancelProject()
                        }}  type="submit">Xác nhận huỷ</Button>
                    }
                    <DialogClose>
                        <Button variant={"outline"} type="submit">Quay lại</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
