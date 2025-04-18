import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import NotificationDialog from "@/components/sites/management/notifications/notification-dialog";
import {toast} from "sonner";
import {cn, formatDate} from "@/lib/utils";
import {TypographySmall} from "@/components/_common/typography/typography-small";
import {TypographyMuted} from "@/components/_common/typography/typography-muted";
import {Check, Mail, MoreHorizontal, Pin, Trash2} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {roleService} from "@/services/role-service";
import {Role} from "@/types/role";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {notificationService} from "@/services/notification-service";

export function SelectRole({roles, setSelectRole, selectRole}: {roles: Role[], setSelectRole: Dispatch<SetStateAction<string | null>>, selectRole: string | null }) {
    return (
        <Select value={selectRole ?? undefined} onValueChange={(value)=> {setSelectRole(value)}}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Vai trò</SelectLabel>
                    {roles.map((role) => (
                        <SelectItem key={role.roleName} value={role.roleName!}>{role.roleName}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

const RoleBasedNotiCard = () => {
    const [content, setContent] = React.useState<string | null>();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [roles, setRoles] = React.useState<Role[]>([]);
    const [selectRole, setSelectRole] = React.useState<string | null>(null);
    useEffect(() => {
        const fetchRole = async () => {
            const response = await roleService.getAll();
            if (response.data && response.data.results) {
                setRoles(response.data.results)
            }
        }
        fetchRole()
    }, []);
    console.log(roles)
    const handleSaveChange = async () => {
        if (!content || !selectRole) {
            toast.error("Nội dung không thể rỗng");
            return;
        }
        setLoading(true);
        const response = await notificationService.createRoleBasedNotification({description: content, role: selectRole});
        if (response.status != 1) {
            toast.error(response.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        toast.success(response.message);
    }

    return (
        <div className={"w-full flex flex-row gap-4"}>
            <div className={"w-2/3"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Tạo thông báo theo vai trò</CardTitle>
                        <CardDescription>
                            Thông báo sẽ được đến tất cả người có cùng vai trò trong hệ thống
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label className={"font-bold"} htmlFor="content">Vai trò</Label>
                            <SelectRole selectRole={selectRole} setSelectRole={setSelectRole} roles={roles} />
                        </div>
                        <div className="space-y-1">
                            <Label className={"font-bold"} htmlFor="content">Nội dung</Label>
                            <Textarea id="content" value={content ?? undefined} onChange={(e) => setContent(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <NotificationDialog handleSaveChange={handleSaveChange} loading={loading} setOpen={setOpen} open={open} />
                    </CardFooter>
                </Card>
            </div>
            <div className={"w-1/3"}>
                <Card>
                    <CardHeader className={"pb-12"}>
                        <CardTitle>Xem trước bản mẫu</CardTitle>
                        <CardDescription>
                            Giao diện thông báo sẽ gửi đến người dùng
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div
                            className={cn(
                                "flex w-full gap-3 items-start p-4 hover:bg-accent transition-colors bg-blue-50/50 dark:bg-blue-900/10"
                            )}
                        >
                            <div className="mt-0.5">
                                <Mail className="size-5 text-blue-500" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <TypographySmall
                                    className={cn("line-clamp-2 font-semibold")}
                                >
                                    {content ?? "Template"}
                                </TypographySmall>
                                <TypographyMuted className="text-xs mt-1">
                                    {formatDate(new Date(Date.now()), true)}
                                </TypographyMuted>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Check className="mr-2 size-4" />
                                        Mark as read
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Pin className="mr-2 size-4" />
                                        Pin
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 size-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RoleBasedNotiCard;