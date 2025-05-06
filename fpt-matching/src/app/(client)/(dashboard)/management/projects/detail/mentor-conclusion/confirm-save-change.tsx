import React, {Dispatch, SetStateAction} from 'react';
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

const ConfirmSaveChange = ({isOpen, setIsOpen, loading, handleSaveChange} :
                           {isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, loading: boolean, handleSaveChange: Function }) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
                <Button className={"mb-8"} onClick={() => {setIsOpen(true)}} variant="default">Cập nhật thay đổi</Button>
            </AlertDialogTrigger>
            <AlertDialogContent  className="sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Quyết định của mentor
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc những cập nhật ở trên. Vui lòng xem lại
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    
                    <AlertDialogCancel onClick={() => {setIsOpen(false)}} >Huỷ</AlertDialogCancel>
                    {!loading ? <Button onClick={() => handleSaveChange()} variant={"default"} type="submit">Tiếp tục lưu</Button>
                        : (
                            <Button disabled>
                                <Loader2 className="animate-spin" />
                                Please wait
                            </Button>
                        )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmSaveChange;