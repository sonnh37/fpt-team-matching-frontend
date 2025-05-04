import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {conversationMemberService} from "@/services/conversation-member-service";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {ConversationMemberInfo} from "@/types/conversation-member-info";
import {Minus, Pencil } from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {UserEmailSuggestions} from "@/types/models/UserEmailSuggestions";
import {userService} from "@/services/user-service";
import {toast} from "sonner";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {Badge} from "@/components/ui/badge";


function DialogAddConversation({userId, setConnection, setToggle}:{userId: string,  setConnection: any, setToggle: Dispatch<SetStateAction<boolean>>}) {
    // joinChatRoom(user.id, null, chatRoom.conversationId)
    // await conn.invoke("JoinSpecificChatRoom", {UserId: username, PartnerId: partnerId, ConversationId: chatroom});
    const [emailTextSuggestion, setEmailTextSuggestion] = React.useState("");
    const [suggestion, setSuggestion] = React.useState<UserEmailSuggestions[]>([]);
    const [suggestionLoading, setSuggestionLoading] = React.useState(false);
    const [suggestionOpen, setSuggestionOpen] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [open, setOpen] = React.useState(false);
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

    const handleSaveChange = async () => {
        setLoading(true);
        try {
            const partner = suggestion.find(x => x.email === emailTextSuggestion);
            if (!partner) {
                toast.error("Không tìm thấy người nhận");
                return;
            }

            if (!message?.trim()) {
                toast.error("Tin nhắn không tồn tại");
                return;
            }

            const conn = new HubConnectionBuilder()
                .withUrl(`${process.env.NEXT_PUBLIC_API_BASE}/Chat`)
                .configureLogging(LogLevel.Information)
                .build();
            conn.on("JoinSpecificChatRoom", (username: string, msg: string) => {
                console.log("msg: ", msg)
            })
            await conn.start();
            setConnection(conn);
            if (userId) {
                await conn.invoke("JoinSpecificChatRoom", {UserId: userId, PartnerId: partner.userId, ConversationId: null});
                await conn.invoke("SendMessage", message)
                setLoading(false);
            }
            setOpen(false);
            setToggle((prev) => !prev)
            toast.success("Gửi tin nhắn thành công")
        } catch (error) {
            console.error(error);
            toast.error("Đã có lỗi xảy ra khi gửi tin nhắn");
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => {setOpen(true)}} className={"text-[1rem] py-6 float-left rounded-md bg-black text-white w-full border-2 border-black hover:bg-white hover:text-black transition-all"}><Pencil /> Tin nhắn mới </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tạo cuộc hội thoại mới</DialogTitle>
                    <DialogDescription>
                        Tạo mới thông qua email của người nhận
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-1 flex flex-col gap-2">
                            <Label className={"font-bold"} htmlFor="email">Email người dùng</Label>
                            <div className="relative w-full ">
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
                    <div className="flex flex-col gap-2">
                        <Label className={"font-bold"} htmlFor="firstMessage">
                            Tin nhắn đầu tiên
                        </Label>
                        <Input
                            id="firstMessage"
                            value={message ?? undefined}
                            className="col-span-3"
                            onChange={e => setMessage(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    {/*<Button onClick={handleSaveChange} type="submit">Gửi tin nhắn</Button>*/}
                    <Button onClick={handleSaveChange} disabled={loading} type="submit">
                        {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const ConversationList = (
    {
        joinChatRoom,
        setChatRoom,
        chatRoom,
        conn,
        setConnection,
        loadMessage,
        setLoadMessage,
        toggle,
        setToggle
    }:
    {
        joinChatRoom : any,
        setChatRoom: any,
        chatRoom: ConversationMemberInfo | undefined,
        conn: HubConnection | undefined,
        setConnection: Dispatch<SetStateAction<HubConnection | undefined>>,
        loadMessage: boolean,
        setLoadMessage: Dispatch<SetStateAction<boolean>>,
        toggle: boolean,
        setToggle: Dispatch<SetStateAction<boolean>>,
    }) => {
    const searchParams = useSearchParams();
    const conversationId = searchParams.get("conversationId");
    const user = useSelector((state: RootState)=> state.user.user)
    const [conversations, setConversations] = useState<ConversationMemberInfo[] | undefined>([]);
    // const [loadMessage, setLoadMessage] = useState<boolean>(false);
    if (!user) {
        window.location.href = "/login"
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!user) {
                    return;
                }
                const data = await conversationMemberService.getConversationPartner(user.id ? user.id : "");
                if (data.data) {
                    data.data.sort((a, b) => new Date(b.lastMessageResult.createdDate).getTime() - new Date(a.lastMessageResult.createdDate).getTime());
                }
                setConversations(data.data)

                if (data.data && chatRoom == null) {
                    if (conversationId) {
                        const filterChatroom = data.data.filter(x => x.id == conversationId)[0];
                        setChatRoom(filterChatroom);
                    } else {
                        setChatRoom(data.data[0])
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [user, conversationId, toggle]);

    useEffect(() => {
        // username: string,  partnerId: string , chatroom: string
        setLoadMessage(true)
        if(chatRoom != null && user != null)
            joinChatRoom(user.id, null, chatRoom.conversationId)
    }, [chatRoom]);
    return user && (
        <div className={"w-[20%] mt-8 ml-4 h-[82vh]  bg-white"}>
            <div className={"w-full flex flex-row items-start"}>
                <DialogAddConversation setToggle={setToggle} setConnection={setConnection} userId={user.id!}  />
            </div>
            <div className={"mt-8"}>
                <Label className={"text-xs font-bold text-gray-700"}>Tin nhắn của bạn</Label>
                <div className={"w-full flex flex-col gap-2 mt-2"}>
                    {conversations != undefined ? conversations.map((conversation, index) => (
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setChatRoom(conversation);
                            }}
                            key={index}
                            className={`hover:cursor-pointer min-h-16 flex justify-between hover:bg-[#f5f5f5] rounded-md
                          ${conversation.lastMessageResult
                                ? conversation.lastMessageResult.isSeen || conversation.lastMessageResult.senderId === user.id
                                    ? "font-medium text-gray-500"
                                    : "font-bold bg-gray-200"
                                : "font-medium"}`}>
                            <div className={"flex items-center gap-4 mx-4"}>
                                <Avatar>
                                    <AvatarImage className={"rounded-full"} src={conversation.partnerInfoResults.avatarUrl != null && conversation.partnerInfoResults.avatarUrl.trim() != "" ? conversation.partnerInfoResults.avatarUrl : "https://github.com/shadcn.png"} alt="@shadcn" />
                                    <AvatarFallback>{conversation.partnerInfoResults.firstName}</AvatarFallback>
                                </Avatar>
                                <div className={"h-full flex flex-col justify-center gap-2 text-left"}>
                                    <div className={"w-[100%] font-bold text-sm text-black"}>
                                        {conversation.partnerInfoResults.lastName} {conversation.partnerInfoResults.firstName}
                                    </div>
                                    <div className={"w-[100%] font-bold text-[12px] text-black flex gap-2 items-center"}>
                                        <div>
                                            {conversation.partnerInfoResults.role.filter(x => x == "Student")[0] ? <Badge className={"bg-white border-black border-[1px] text-black hover:bg-black hover:text-white"} >Sinh viên</Badge>: <Badge>Giảng viên</Badge>}
                                        </div>
                                        <Minus className={"text-black"} size={10} />
                                        <div>
                                            {conversation.partnerInfoResults.code}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : ""}
                </div>
            </div>
        </div>
    );
};

export default ConversationList;