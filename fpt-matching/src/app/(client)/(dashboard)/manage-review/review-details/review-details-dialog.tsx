import { Button } from "@/components/ui/button"
import {cloudinaryService} from "@/services/cloudinary-service";
import {AlertDialog, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Loader2} from "lucide-react";
import {useSearchParams} from "next/navigation";
import { reviewService } from "@/services/review-service";
import {toast} from "sonner";
import {useSelectorUser} from "@/hooks/use-auth";


export function ReviewDetailsDialog(
    {file, isOpen, setIsOpen, reviewDate, leaderId} :
    {file: File, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, reviewDate: Date| null, leaderId: string}
) {
    const [loading, setLoading] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const reviewId = searchParams.get('reviewId');
    const user = useSelectorUser()
    const handleSaveChange = async () => {
        try {
            //1. set loading
            setLoading(true)
            //2. upload file
            const result = await cloudinaryService.uploadFile(file)
            if(reviewId && result) {
                const response = await reviewService.uploadFileUrp({reviewId: reviewId, fileUrl: result})
                console.log(response)
                if (response.status == 1) {
                   toast.success("Cập nhật thành công");
                } else {
                    toast.error(response.message);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
        setLoading(false)
        setIsOpen(false)
    }
    return user && (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                {user.id != leaderId ? <div></div> : reviewDate && reviewDate.getDate() == new Date(Date.now()).getDate() ?
                    <Button onClick={() => {setIsOpen(true)}} variant="destructive">Tải file lên</Button> : <Button disabled={true} className={"bg-red-400 hover:bg-red-400 "} variant="destructive">Tải file lên</Button>
                }
            </AlertDialogTrigger>
            <AlertDialogContent  className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Cập nhật file Checklist</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc với những thông tin trong file ? <br />
                        {/*Có thể chỉnh sửa sau khi cập nhật*/}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {!loading ? <Button onClick={handleSaveChange} variant={"destructive"} type="submit">Cập nhật</Button>
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
