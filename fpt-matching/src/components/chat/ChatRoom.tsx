import React, {useEffect, useState} from "react";
import {HubConnection} from "@microsoft/signalr";
import {messageService} from "@/services/message-service";
import {MessageModel} from "@/types/message-model";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatMessageInput from "@/components/chat/ChatMessageInput";
import {ConversationMemberInfo} from "@/types/conversation-member-info";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const ChatRoom = ({conn, messages, setMessages, chatRoom} : { conn: HubConnection, messages: MessageModel[], setMessages: any, chatRoom: ConversationMemberInfo | undefined}) => {
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    // const [lastHeight, setLastHeight] = useState<number>(0);
    //
    // const observer = useRef<IntersectionObserver>();
    // const containerRef = useRef<HTMLDivElement | null>(null);

    const getMessageInDay = async () => {
        if(chatRoom){
            const result = await messageService.fetchMessageInDay(chatRoom.conversationId)
            setMessages(result.data)
            if (result.data == null || result.data.length < 10) {
                const messageConversation = await messageService.fetchMessageByConversationId(chatRoom.conversationId, 15, pageNumber)
                setMessages((messages: MessageModel[]) => [...messageConversation.data!, ...messages]);
            }
        }
    }

    const fetchMessage = async () => {
        if(chatRoom){
            const messageConversation = await messageService.fetchMessageByConversationId(chatRoom.conversationId, 15, pageNumber)
            if (messageConversation.data?.length == 0) {
                setHasMore(false);
                return;
            }
            setMessages((messages: MessageModel[]) => [...messageConversation.data!, ...messages]);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (pageNumber === 1) {
                    await getMessageInDay();
                } else {
                    await fetchMessage();
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [pageNumber])


    const sendMessage = async (message: string) => {
        try {
            await conn?.invoke("SendMessage", message)
        } catch (error) {
            console.error(error);
        }
    }
    // const lasMessageElementRef = (node:HTMLDivElement) => {
    //     if (loading) return;
    //     observer.current = new IntersectionObserver((entries) => {
    //         if (entries[0].isIntersecting && hasMore) {
    //             setPageNumber(prevState => prevState + 1);
    //         }
    //     });
    //     if (node) observer.current.observe(node);
    //     return () => observer.current?.disconnect();
    // }
    //
    // const scrollHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const chat = event.target;
    //     if (chat.scrollTop === 0) {
    //         const { scrollHeight } = containerRef.current!;
    //         setLastHeight(scrollHeight);
    //     }
    // };
    return (
        <div className={"h-screen"}>
            <div className={""}>
                <div className={"w-full bg-white min-h-[10vh] leading-[5rem] font-bold text-lg pl-8 flex items-center gap-4"}>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {chatRoom?.partnerInfoResults.firstName + " " + chatRoom?.partnerInfoResults.lastName}
                </div>
            </div>
            <div className={"h-[90vh] flex flex-col justify-between"}>
                {/*<MessageContainer containerRef={containerRef} scrollHandler={scrollHandler} lastHeight={lastHeight}  messages={messages} refer={lasMessageElementRef} />*/}
                {/*<SendMessageForm sendMessage={sendMessage}  />*/}
                <ChatMessage messages={messages}/>
                <ChatMessageInput sendMessage={sendMessage} />
            </div>
            {/*<div>{loading && 'Loading...'}</div>*/}
        </div>
    )
}

export default ChatRoom;