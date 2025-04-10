import { Button } from "@/components/ui/button"
import {cloudinaryService} from "@/services/cloudinary-service";
import {AlertDialog, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import React, {Dispatch, SetStateAction, useState} from "react";
import {Loader2} from "lucide-react";
import {toast} from "sonner";
import {ideaHistoryService} from "@/services/idea-history-service";


export function EditIdeaDialog(
    {file, reviewNumber, ideaId, note ,isOpen, setIsOpen} :
    {file: File, reviewNumber: number, ideaId:string ,isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, note: string | null}
) {
    const [loading, setLoading] = useState<boolean>(false);


    const handleSaveChange = async () => {
        try {
            //1. set loading
            setLoading(true)
            //2. upload file
            const result = await cloudinaryService.uploadFile(file)
            // if(reviewId && result) {
            //     const response = await reviewService.uploadFileUrp({reviewId: reviewId, fileUrl: result})
            //     console.log(response)
            //     if (response.status == 1) {
            //         toast.success("Successfully uploaded");
            //     } else {
            //         toast.error(response.message);
            //     }
            // }
            if (result) {
                const response = await ideaHistoryService.studentUpdateIdea({ideaId, fileUpdate: result, reviewStage: reviewNumber, note})
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
                <Button onClick={() => {setIsOpen(true)}} variant="destructive">Upload file</Button>
            </AlertDialogTrigger>
            <AlertDialogContent  className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Upload checklist</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure want to upload this file ?
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
