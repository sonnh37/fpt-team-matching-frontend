import { Button } from "@/components/ui/button"
import {cloudinaryService} from "@/services/cloudinary-service";
import {AlertDialog, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Loader2} from "lucide-react";
import {toast} from "sonner";
import {topicVersionService} from "@/services/topic-version-service";


export function EditTopicDialog(
    {file, reviewNumber, topicId, note ,isOpen, setIsOpen} :
    {file: File, reviewNumber: number, topicId:string ,isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, note: string | null}
) {
    const [loading, setLoading] = useState<boolean>(false);


    const handleSaveChange = async () => {
        try {
            //1. set loading
            setLoading(true)
            // Kiểm tra ngày hợp lệ hay không

            //2. upload file
            const result = await cloudinaryService.uploadFile(file)
            if (result) {
                const response = await topicVersionService.updateByStudent({topicId: topicId, fileUpdate: result, reviewStage: reviewNumber, note})
                    if (response.status == 1) {
                        toast.success("Cập nhật thành công");
                    } else {
                        toast.error(response.message);
                    }
            }

        } catch (error: any) {
            toast.error(error.message);
        }
        finally {
            setLoading(false)
            setIsOpen(false)
        }
    }
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                <Button className={"mb-8"} onClick={() => {setIsOpen(true)}} variant="default">Cập nhật</Button>
            </AlertDialogTrigger>
            <AlertDialogContent  className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Cập nhật đề tài</AlertDialogTitle>
                    <AlertDialogDescription>
                         Bạn có chắc đây là thông tin cần cập nhật? Vui lòng kiểm tra lại trước khi nộp
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  
                    <AlertDialogCancel onClick={() => {setIsOpen(false)}}>Huỷ</AlertDialogCancel>
                    {!loading ? <Button onClick={handleSaveChange} variant={"default"} type="submit">Cập nhật</Button>
                        : (
                            <Button disabled>
                                <Loader2 className="animate-spin" />
                                Đang xử lí
                            </Button>
                        )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
