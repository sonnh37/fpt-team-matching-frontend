import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {HubConnection} from "@microsoft/signalr";
import {messageService} from "@/services/message-service";
import {MessageModel} from "@/types/message-model";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatMessageInput from "@/components/chat/ChatMessageInput";
import {ConversationMemberInfo} from "@/types/conversation-member-info";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
const ChatRoom = ({setLoadMessage, conn, messages, setMessages, chatRoom, loadMessage} : {setLoadMessage: Dispatch<SetStateAction<boolean>>, conn: HubConnection, messages: MessageModel[], setMessages: any, chatRoom: ConversationMemberInfo | undefined, loadMessage: boolean}) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [hasMore, setHasMore] = useState(true);
    // const [lastHeight, setLastHeight] = useState<number>(0);
    //
    // const observer = useRef<IntersectionObserver>();
    // const containerRef = useRef<HTMLDivElement | null>(null);

    const getMessageInDay = async () => {
        if(chatRoom){
            const result = await messageService.getMessageInDay(chatRoom.conversationId)
            setMessages(result.data)
            if (result.data == null || result.data.length < 10) {
                const messageConversation = await messageService.getMessageByConversationId(chatRoom.conversationId, 15, pageNumber)
                setMessages((messages: MessageModel[]) => [...messageConversation.data!, ...messages]);
            }
        }
    }

    const fetchMessage = async () => {
        if(chatRoom){
            const messageConversation = await messageService.getMessageByConversationId(chatRoom.conversationId, 15, pageNumber)
            if (messageConversation.data?.length == 0) {
                setHasMore(false);
                return;
            }
            // setMessages((messages: MessageModel[]) => [...messageConversation.data!, ...messages]);
            setMessages(() => messageConversation.data!);
        }
    }
    useEffect(() => {
        console.log("Fetch message at chat room")
        const fetchData = async () => {
            setLoadMessage(true)
            try {
                if (pageNumber === 1) {
                    await getMessageInDay();
                } else {
                    await fetchMessage();
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoadMessage(false)

            }
        };

        fetchData();
    }, [pageNumber, chatRoom])


    const sendMessage = async (message: string) => {
        try {
            await conn?.invoke("SendMessage", message)
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className={""}>
            <div className={"mt-2"}>
                <div className={"w-full bg-white min-h-[10vh] leading-[5rem] font-bold text-lg pl-8 flex items-center gap-4"}>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Link className={"hover:bg-gray-100 rounded-md px-4"} href={`/social/blog/profile-social/${chatRoom?.partnerInfoResults.id}`}>{chatRoom?.partnerInfoResults.lastName + " " + chatRoom?.partnerInfoResults.firstName}</Link>
                </div>
            </div>
            <div className={"flex flex-col justify-between border-gray-200 border-[1px] rounded-md p-4"}>
                {/*<MessageContainer containerRef={containerRef} scrollHandler={scrollHandler} lastHeight={lastHeight}  messages={messages} refer={lasMessageElementRef} />*/}
                {/*<SendMessageForm sendMessage={sendMessage}  />*/}
                <ChatMessage loadMessage={loadMessage} messages={messages}/>
                <ChatMessageInput sendMessage={sendMessage} />
            </div>
            {/*<div>{loading && 'Loading...'}</div>*/}
        </div>
    )
}

export default ChatRoom;