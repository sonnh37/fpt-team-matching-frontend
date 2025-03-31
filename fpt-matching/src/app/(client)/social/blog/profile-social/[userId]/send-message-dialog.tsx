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
import {useState} from "react";

export function SendMessageDialog() {
    const [conn, setConnection] = useState<HubConnection>();
    const [message, setMessage] = useState<string>("Nhô");
    const user = useSelectorUser()
    const { userId } = useParams()
    const partnerId = userId.toString();
    const router = useRouter();

    const handleSendMessage = async () => {
        const conn = new HubConnectionBuilder()
            .withUrl(`http://localhost:8081/Chat`)
            .configureLogging(LogLevel.Information)
            .build();
        conn.on("JoinSpecificChatRoom", (username: string, msg: string) => {
            console.log("msg: ", msg)
        })
        await conn.start();
        setConnection(conn);
        if (user) {
            await conn.invoke("JoinSpecificChatRoom", {UserId: user.id, PartnerId: partnerId, ConversationId: null});
            // await sendMessage(message)
            await conn.invoke("SendMessage", message)
            router.push("/social/chat")
        }
    }
    // const sendMessage = async (message: string) => {
    //     try {
    //         await conn?.invoke("SendMessage", message)
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"ml-2"} variant="outline">Nhắn tin</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Hãy nhập tin nhắn cần gửi</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                            Message
                        </Label>
                        <Input
                            id="message"
                            value={message}
                            className="col-span-3"
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSendMessage}>Send message</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

