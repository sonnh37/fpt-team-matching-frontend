import React, {Dispatch, SetStateAction, useState} from "react";

import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {topicVersionRequestService} from "@/services/topic-version-request-service";
import {TopicVersionRequestStatus} from "@/types/enums/topic-version-request";

export function UpdateIdeaDialog(
    {isOpen, setIsOpen, comment, decision, ideaHistoryId, setDecision, setStatus} :
    {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, comment: string | null, decision: TopicVersionRequestStatus | null, ideaHistoryId : string, setDecision:Dispatch<SetStateAction<TopicVersionRequestStatus | null>>, setStatus: Dispatch<SetStateAction<TopicVersionRequestStatus | null>>}
) {
    const [loading, setLoading] = useState<boolean>(false);


    const handleSaveChange = async () => {
        try {
            //1. set loading
            setLoading(true)
            //2. upload file
            // const result = await cloudinaryService.uploadFile(file)
            console.log(comment)
            if (!comment) {
                toast.error("Vui lòng điền nhận xét");
                throw new Error("Comment is missing");
            }
            if (!decision) {
                toast.error("Quyết định cuối cùng không phù hợp")
                throw new Error("Quyết định cuối cùng không phù hợp");
            }
            const result = await topicVersionRequestService.responseByManagerOrMentor({
                feedback: comment,
                status: decision,
                id: ideaHistoryId
            })

            if (result && result.status == 1) {
                toast.success("cập nhật lại đề tài thành công!");
                setStatus(decision);
            } else {
                toast.error(`Error updating idea history: ${result.message}`);
            }

        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            toast.error(error.message);
        }
        setLoading(false)
        setIsOpen(false)
    }
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                <div className={" flex flex-col gap-2"}>
                    <Button
                        onClick={() => {
                            setIsOpen(true)
                            setDecision(TopicVersionRequestStatus.Approved)
                        }}
                        variant={"default"}
                        className={"bg-green-500"}
                    >
                        Đồng ý duyệt
                    </Button>
                    <Button
                        onClick={() => {
                            setIsOpen(true)
                            setDecision(TopicVersionRequestStatus.Rejected)
                        }}
                        variant={"default"}
                        className={"bg-red-500"}
                    >
                        Từ chối chỉnh sửa
                    </Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent  className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Chỉnh sửa đề tài</AlertDialogTitle>
                    <AlertDialogDescription>
                        {decision == TopicVersionRequestStatus.Approved ? "Bạn có chắc là ĐỒNG Ý duyệt chỉnh sửa đề tài này không?" : "Bạn có chắc là TỪ CHỐI chỉnh sửa đề tài này không?"}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {!loading ? <Button onClick={handleSaveChange} variant={"destructive"} type="submit">Cập nhật</Button>
                        : (
                            <Button disabled>
                                <Loader2 className="animate-spin" />
                                Đang xử lí
                            </Button>
                        )}
                    <AlertDialogCancel onClick={() => {setIsOpen(false)}} className={"bg-amber-600"}>Huỷ</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}