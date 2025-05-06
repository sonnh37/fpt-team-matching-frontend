import React, {Dispatch, SetStateAction, useState} from 'react';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {User} from "@/types/user";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Department} from "@/types/enums/user";
import {userService} from "@/services/user-service";
import {toast} from "sonner";


function UserConfirmationTable({users} : {users: User[]}) {
    return (
        <Table className={"w-full"}>
            <TableCaption>Danh sách các tài khoản đã tồn tại trong hệ thống</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Mã người dùng</TableHead>
                    <TableHead className={"text-center"}>
                        Họ và tên
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Số điện thoại</TableHead>
                    <TableHead className="text-center">Cơ sở</TableHead>
                    <TableHead className="text-center">Tài khoản</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.code}>
                        <TableCell className="font-bold text-center">{user.code}</TableCell>
                        <TableCell className={"text-center"}>{user.firstName} {user.lastName}</TableCell>
                        <TableCell className={"text-center"}>{user.email}</TableCell>
                        <TableCell className={"text-center"}>{user.phone ?? "Empty"}</TableCell>
                        <TableCell className={"text-center"}>{Department[user.department ?? 0]}</TableCell>
                        <TableCell className={"text-center"}>{user.username}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Tổng số lượng: </TableCell>
                    <TableCell className="text-right">{users.length.toString()}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

const DialogConfirmUpdate = ({open, setOpen, usersConfirm, role, semesterId} : {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, usersConfirm: User[], role: string, semesterId: string}) => {
    const [loading, setLoading] = useState(false);
    const handleSaveChange = async () => {
        setLoading(true);

        const response = await userService.updateExistedUser({users: usersConfirm, semesterId});
        if (response.status && response.status !== 1) {
            toast.error(response.status);
            setLoading(false);
            setOpen(false);
            return;
        }
        setLoading(false);
        setOpen(false)
        toast.success(response.message)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/*<Button onClick={() => setOpen(true)} className={"self-end mr-6"} variant="default">Tạo tài khoản</Button>*/}
            </DialogTrigger>
            <DialogContent className="w-full">
                <DialogHeader>
                    <DialogTitle>Xác nhận cập nhật</DialogTitle>
                </DialogHeader>
                {role == "Student" ? (
                    <div className="grid gap-4 pb-4 text-[14px] text-gray-600">
                        Đây là những tài khoản đã tồn tại. Nếu tiếp tục thì CHỈ sẽ cập nhật lại KỲ của những tài khoản này vào KỲ tiếp theo. <br /> Vui lòng cân nhắc trước khi tiếp tục.
                    </div>
                ) : (
                    <div className="grid gap-4 pb-4 text-[14px] text-gray-600">
                        Đây là những tài khoản đã tồn tại.
                    </div>
                )}
                <div className={"w-full"}>
                   <UserConfirmationTable users={usersConfirm} />
                </div>
                <DialogFooter>
                    {loading ?
                        <Button disabled>
                            <Loader2 className="animate-spin"/>
                            Please wait
                        </Button> :
                       <>
                       {
                            role == "Student" && (
                               <Button
                                   onClick={() => handleSaveChange()}
                                   type="submit">Xác nhận</Button>
                           )
                       }
                           <Button onClick={() => {
                               setOpen(false);
                           }} variant={"outline"} type={"submit"}>Không cập nhật</Button>
                       </>

                    }

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

export default DialogConfirmUpdate;