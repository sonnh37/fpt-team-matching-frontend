import React, {Dispatch, SetStateAction} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

function NotificationDialog({handleSaveChange, loading, open, setOpen}: {handleSaveChange: Function, loading: boolean, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className={"self-end mr-6"} variant="default">Tạo thông báo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo tài khoản mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    Bạn có chắc các thông tin đã chính xác.<br/> Hành động này sẽ không thể hoàn tác.
                </div>
                <DialogFooter>
                    {loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button> :
                        <Button onClick={() => {
                            handleSaveChange()
                        }} type="submit">Xác nhận</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NotificationDialog;