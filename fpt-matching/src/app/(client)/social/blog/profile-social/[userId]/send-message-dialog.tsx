import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {useSelectorUser} from "@/hooks/use-auth";
import { useParams, useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {ConversationMemberInfo} from "@/types/conversation-member-info";
import {conversationMemberService} from "@/services/conversation-member-service";

export function SendMessageDialog() {
    const [conn, setConnection] = useState<HubConnection>();
    const [message, setMessage] = useState<string| null>(null);
    const [conversion, setConversion] = useState<ConversationMemberInfo | null>();

    const user = useSelectorUser()
    const { userId } = useParams()
    const partnerId = userId.toString();
    const router = useRouter();

    useEffect(() => {
        if (!user || !user.id) {
            return;
        }
        const fetchConversation = async () => {
            const response = await conversationMemberService.getConversationPartner(user.id!)
            if (!response.data) {
                return;
            }
            if (response.data.length == 0) {
                return;
            }
            const filter = response.data.filter(x =>x .partnerInfoResults.id == partnerId)[0]
            if (!filter) {
                return;
            }
            setConversion(filter);
        }
        fetchConversation()

    }, [user])
    const handleSendMessage = async () => {

        const conn = new HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_BASE}/chat`)
            .configureLogging(LogLevel.Information)
            .build();
        conn.on("JoinSpecificChatRoom", (username: string, msg: string) => {
            console.log("msg: ", msg)
        })
        await conn.start();
        setConnection(conn);
        if (user) {
            await conn.invoke("JoinSpecificChatRoom", {UserId: user.id, PartnerId: partnerId, ConversationId: conversion?.id});
            await conn.invoke("SendMessage", message)
            router.push(`/chat`)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {
                    conversion ? <Button onClick={(event) => {
                        event.preventDefault()
                        router.push(`/chat?conversationId=${conversion?.id}`)
                    }} className={"ml-2"} variant="outline">Nhắn tin</Button> : <Button className={"ml-2"} variant="outline">Nhắn tin</Button>
                }
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Hãy nhập tin nhắn cần gửi</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                            Tin nhắn
                        </Label>
                        <Input
                            id="message"
                            value={message ?? undefined}
                            className="col-span-3"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => {

                        handleSendMessage()
                    }}>Gửi tin nhắn</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

