import MessageContainer from "@/components/chat/MessageContainer";
import SendMessageForm from "@/components/chat/SendMessageForm";
import {useEffect} from "react";
import {HubConnection} from "@microsoft/signalr";
interface MessageModel {
    content: string;
    conversationId: string;
    createdDate: Date;
    id: string;
    sendById: string;
}
const ChatRoom = ({conn, messages, setMessage} : { conn: HubConnection, messages: string[], setMessage: any}) => {
    useEffect(() => {
        fetch("http://localhost:5045/api/message/0f3f44a4-4d3a-49ae-b5c6-c136257db5e7")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP errsor! Sstatus: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.result.data);
                const listMessage: string[] = [];
                data.result.data.map((x : MessageModel)=> {
                    listMessage.push(x.content)
                })
                setMessage(listMessage);
                return data.result.data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [setMessage])


    const sendMessage = async (message: string) => {
        try {
            await conn?.invoke("SendMessage", message)
        } catch (e : any) {
            console.error(e);
        }
    }

    return (
        <div className={"min-h-screen"}>
            <div className={""}>
                <div className={"w-full bg-white min-h-[10vh] text-center leading-[5rem] font-bold text-2xl"}>
                    User name
                </div>
            </div>
            <div className={"min-h-[90vh] flex flex-col justify-between"}>
                    <MessageContainer messages={messages} />
                    <SendMessageForm sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default ChatRoom;