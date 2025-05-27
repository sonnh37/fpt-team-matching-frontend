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
import React, {Dispatch, SetStateAction} from "react";
import {stagetopicService} from "@/services/stage-topic-service";
import {toast} from "sonner";
import {Loader2} from "lucide-react";


export function PublicResultDialog({stageTopicId, openPublicStage, setOpenPublicStage} : {stageTopicId: string, openPublicStage: boolean, setOpenPublicStage: Dispatch<SetStateAction<boolean>>}) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const handlePublic = async () => {
        try {
            setLoading(true);
            const response = await stagetopicService.pubicStageTopic({stageTopicId})
            if (response.status != 1) {
                toast.error(response.message)
                return;
            }
            toast.success(response.message)
            window.location.reload()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={openPublicStage} onOpenChange={setOpenPublicStage}>
            <DialogTrigger asChild>
                {/*<Button variant="outline">Edit Profile</Button>*/}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận công khai kết quả đợt duyệt</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn công khai kết quả đợt duyệt chứ.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    {loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Đang xử lí
                        </Button> :
                        <Button onClick={() => {
                            handlePublic()
                        }} type="submit">Công khai</Button>
                    }
                    <DialogClose>
                        <Button variant={"outline"} >Huỷ</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
