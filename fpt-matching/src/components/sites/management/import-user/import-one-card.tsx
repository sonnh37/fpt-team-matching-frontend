import React, {Dispatch, SetStateAction,  useState } from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Asterisk, Loader2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import UserCreateByManagerCommand from "@/types/models/commands/users/user-create-by-manager-command";
import {userService} from "@/services/user-service";
import {toast} from "sonner";
import DialogConfirmUpdate from "@/components/sites/management/import-user/dialog-confirm-update";
import { User } from '@/types/user';
function ImportOneCardDialog({handleSaveChange, loading, open, setOpen}: {handleSaveChange: Function, loading: boolean, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className={"self-end mr-6"} variant="default">Tạo tài khoản</Button>
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
                            Đang xử lí
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
export const ImportOneCard = ({role, semesterId}: {role: string, semesterId: string | null}) => {
    const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [usersConfirm, setUsersConfirm] = React.useState<User[]>([]);
    const [userCreateCommand, setUserCreateCommand] = React.useState<UserCreateByManagerCommand>({} as UserCreateByManagerCommand);
    const handleSaveChange = async () => {
        setLoading(true);
        if (
            userCreateCommand.firstname.trim() == null &&
            userCreateCommand.lastname.trim() == null &&
            userCreateCommand.username.trim() == null &&
            userCreateCommand.email.trim() == null
        ) {
            setLoading(false)
            toast.error("Vui lòng nhập đầy đủ tất cả các field")
            return;
        }
        let response;
        if (role == "Student") {
            console.log(semesterId);
            if (semesterId == null) {
                toast.error("Kì hiện tại không tồn tại")
                return;
            }
            userCreateCommand.semesterId = semesterId;
            response = await userService.createOneStudentByManager(userCreateCommand);
            if (response.status != 1 && response.status != 2) {
                setOpen(false);
                toast.error(response.message)
                setLoading(false)
                return;
            }

            if (response.status == 2) {
                if (response.data) {
                    toast.info(response.message)
                    setUsersConfirm([response.data])
                    setOpenConfirmDialog(true)
                    setLoading(false)
                }
                return;
            }
            setLoading(false)
            setOpen(false)
            toast.success(response.message)
        }
        if (role == "Lecturers") {
            response = await userService.createOneLecturerByManager(userCreateCommand);
            if (response.status != 1 && response.status != 2) {
                setOpen(false);
                toast.error(response.message)
                setLoading(false)
                return;
            }

            if (response.status == 2) {
                if (response.data) {
                    toast.info(response.message)
                    setUsersConfirm([response.data])
                    setOpenConfirmDialog(true)
                    setLoading(false)
                }
                return;
            }
            setLoading(false)
            setOpen(false)
            toast.success(response.message)
        }
    }
    return (
        <>
            {usersConfirm.length > 0 && <DialogConfirmUpdate semesterId={semesterId} role={role} usersConfirm={usersConfirm} open={openConfirmDialog} setOpen={setOpenConfirmDialog} />}
            <Card className={"w-1/2"}>
                <CardHeader className={"flex justify-center items-center"}>
                    <CardTitle>Thêm 1 tài khoản mới</CardTitle>
                    <CardDescription className={"flex flex-row gap-2 items-center"}>
                        <Asterisk className={"text-red-500 size-4"} />
                        <p>là những mục yêu cầu điền. Vui lòng điền tất cả để tạo tài khoản</p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex flex-col gap-4">
                    <div className={"flex flex-row justify-between items-center w-full gap-10"}>
                        <div className="space-y-1 w-full">
                            <div className={"flex flex-row items-center gap-2 w-full"}>
                                <Label className={"font-bold"} htmlFor="name">Họ</Label>
                                <Asterisk className={"text-red-500 size-4"} />
                            </div>
                            <Input
                                id="name"
                                onChange={(e) => {
                                    setUserCreateCommand(prev => {
                                        return {
                                            ...prev,
                                            firstname: e.target.value
                                        }
                                    })
                                }} />
                        </div>
                        <div className="space-y-1 w-full">
                            <div className={"flex flex-row gap-2 items-center w-full"}>
                                `      <Label className={"font-bold"} htmlFor="name">Tên</Label>
                                <Asterisk className={"text-red-500 size-4"} />
                            </div>
                            <Input
                                id="name"
                                onChange={(e) => {
                                    setUserCreateCommand(prev => {
                                        return {
                                            ...prev,
                                            lastname: e.target.value
                                        }
                                    })
                                }}
                            />
                        </div>

                    </div>
                    <div className={"flex flex-col gap-4"}>
                        <div className="space-y-1 w-full">
                            <div className={"flex flex-row gap-2 items-center w-full"}>
                                <Label className={"font-bold"} htmlFor="code">Mã người dùng</Label>
                                <Asterisk className={"text-red-500 size-4"} />
                            </div>
                            <Input
                                id="code"
                                onChange={(e) => {
                                    setUserCreateCommand(prev => {
                                        return {
                                            ...prev,
                                            code: e.target.value
                                        }
                                    })
                                }}
                            />
                        </div>
                        <div className="space-y-1 w-full">
                            <div className={"flex flex-row gap-2 items-center w-full"}>
                                <Label className={"font-bold"} htmlFor="username">Tên tài khoản</Label>
                                <Asterisk className={"text-red-500 size-4"} />
                            </div>
                            <Input
                                id="username"
                                onChange={(e) => {
                                    setUserCreateCommand(prev => {
                                        return {
                                            ...prev,
                                            username: e.target.value
                                        }
                                    })
                                }}
                            />
                        </div>
                        <div className="space-y-1 w-full">
                            <div className={"flex flex-row gap-2 items-center w-full"}>
                                <Label className={"font-bold"} htmlFor="email">Email</Label>
                                <Asterisk className={"text-red-500 size-4"} />
                            </div>
                            <Input
                                type={"email"}
                                id="email"
                                onChange={(e) => {
                                    setUserCreateCommand(prev => {
                                        return {
                                            ...prev,
                                            email: e.target.value
                                        }
                                    })
                                }}
                            />
                        </div>
                        <div className="space-y-1 w-full">
                            <Label className={"font-bold"} htmlFor="phone">Số điện thoại</Label>
                            <Input
                                id="phone"
                                type={"number"}
                                onChange={(e) => {
                                    setUserCreateCommand(prev => {
                                        return {
                                            ...prev,
                                            phone: e.target.value
                                        }
                                    })
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <ImportOneCardDialog setOpen={setOpen} open={open} loading={loading} handleSaveChange={handleSaveChange} />
                </CardFooter>
            </Card>
        </>
    );
};

