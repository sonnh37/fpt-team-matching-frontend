import React, {Dispatch, SetStateAction} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import NotificationDialog from "@/components/sites/management/notifications/notification-dialog";
import {toast} from "sonner";
import {cn, formatDate} from "@/lib/utils";
import {TypographySmall} from "@/components/_common/typography/typography-small";
import {TypographyMuted} from "@/components/_common/typography/typography-muted";
import {BellDot, Check, MoreHorizontal, Pin, Trash2} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {UserEmailSuggestions} from "@/types/models/UserEmailSuggestions";
import {userService} from "@/services/user-service";
import { Input } from '@/components/ui/input';
import {notificationService} from "@/services/notification-service";

const InvidualNotiCard = () => {
    const [content, setContent] = React.useState<string | null>();
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [emailTextSuggestion, setEmailTextSuggestion] = React.useState("");
    const [suggestion, setSuggestion] = React.useState<UserEmailSuggestions[]>([]);
    const [suggestionLoading, setSuggestionLoading] = React.useState(false);
    const [suggestionOpen, setSuggestionOpen] = React.useState(false);
    const handleSaveChange = async () => {
        if (suggestion.filter(x => x.email === emailTextSuggestion).length == 0) {
            toast.error(`User with email ${emailTextSuggestion} not found.`);
            return;
        }
        const userId = suggestion.filter(x => x.email === emailTextSuggestion)[0].userId
        if (!content || !userId) {
            toast.error("Nội dung không thể rỗng");
            return;
        }
        setLoading(true);
        const response = await notificationService.createIndividualNotification({description: content, userId});
        if (response.status != 1) {
            toast.error(response.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        toast.success(response.message);
    }

    React.useEffect(() => {
        const fetchData = async () => {
            setSuggestionLoading(true);
            const response = await userService.getUserEmailSuggestions(emailTextSuggestion);
            if (response.data){
                setSuggestion(response.data);
                setSuggestionLoading(false);

            }
        }
        const delayDebounce =  setTimeout(async () => {
            if (emailTextSuggestion.trim().length > 0) {
                await fetchData()
            } else {
                setSuggestion([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [emailTextSuggestion]);
    return (
        <div className={"w-full flex flex-row gap-4"}>
            <div className={"w-2/3"}>
                <Card>
                    <CardHeader>
                        <CardTitle>Tạo thông báo hệ thống</CardTitle>
                        <CardDescription>
                            Thông báo sẽ được đến 1 người dùng
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1 flex flex-row gap-4 items-center">
                            <Label className={"font-bold"} htmlFor="email">Email người dùng</Label>
                            <div className="relative w-1/2 ">
                                <Input
                                    type="text"
                                    value={emailTextSuggestion}
                                    onChange={(e) => {
                                        setEmailTextSuggestion(e.target.value)
                                        setSuggestionOpen(true)
                                    }}
                                    placeholder="Nhập email..."
                                    className="w-full border px-4 py-2 rounded"
                                />

                                {suggestionOpen && suggestion.length > 0 && !suggestionLoading && (
                                    <ul className="absolute bg-white border w-full mt-1 rounded shadow z-10">
                                        {suggestion.map((item, index) => (
                                            <li
                                                key={index}
                                                onClick={() => {
                                                    setEmailTextSuggestion(item.email)
                                                    setSuggestionOpen(false)
                                                }}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {item.email}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {suggestionLoading && (
                                    <div className="absolute right-2 top-2 text-sm text-gray-400">Đang tìm...</div>
                                )}
                            </div>
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
                                <BellDot className="size-5 text-orange-500" />
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
export default InvidualNotiCard;