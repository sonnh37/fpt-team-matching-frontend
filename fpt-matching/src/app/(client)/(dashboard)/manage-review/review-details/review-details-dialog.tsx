import { Button } from "@/components/ui/button"
import {cloudinaryService} from "@/services/cloudinary-service";
import {AlertDialog, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Loader2} from "lucide-react";
import {useSearchParams} from "next/navigation";
import { reviewService } from "@/services/review-service";
import {toast} from "sonner";


export function ReviewDetailsDialog(
    {file, isOpen, setIsOpen, reviewDate} :
    {file: File, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, reviewDate: Date| null}
) {
    const [loading, setLoading] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const reviewId = searchParams.get('reviewId');
    console.log(reviewId)
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
                   toast.success("Successfully uploaded");
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
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                {reviewDate && reviewDate.getDate() != new Date(Date.now()).getDate() ?
                    <Button onClick={() => {setIsOpen(true)}} variant="destructive">Upload file</Button> : <Button disabled={true} className={"bg-red-400 hover:bg-red-400 "} variant="destructive">Upload file</Button>
                }
            </AlertDialogTrigger>
            <AlertDialogContent  className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Cập nhật file Checklist</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc với những thông tin trong file ? <br /> Có thể chỉnh sửa sau khi cập nhật
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {!loading ? <Button onClick={handleSaveChange} variant={"destructive"} type="submit">Save changes</Button>
                        : (
                        <Button disabled>
                            <Loader2 className="animate-spin" />
                            Please wait
                        </Button>
                        )}
                    <AlertDialogCancel onClick={() => {setIsOpen(false)}} className={"bg-amber-600"}>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
