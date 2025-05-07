import React from 'react';
import { ChatMessageList } from '../ui/chat/chat-message-list';
import {ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleTimestamp} from '../ui/chat/chat-bubble';
import {MessageModel} from "@/types/message-model";
import {useSelectorUser} from "@/hooks/use-auth";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

const ChatMessage = ({messages, loadMessage} : {messages:MessageModel[], loadMessage: boolean}) => {
    // const uniqueMessages = messages.filter((msg, index, self) =>
    //     index === self.findIndex((m) => m.id === msg.id)
    // );
    const user = useSelectorUser()
    const distinctMessages = Array.from(
        new Map(messages.map(message => [message.id, message])).values()
    );
    return (
            // Wrap with ChatMessageList
            <div className={""}>
               {/*eslint-disable-next-line react/jsx-no-comment-textnodes*/}
                <ChatMessageList className={""}>
                    {!loadMessage ? messages && distinctMessages.map((message, index) => (
                        <div key={index} className={"flex flex-col"}>
                            <ChatBubble key={index} variant={user && user.id == message.sendById ? "sent" : "received"}>
                                {user && <ChatBubbleAvatar fallback="us" src={user.avatar ?? ""} />}
                                <ChatBubbleMessage variant='sent'>
                                    {message.content}
                                </ChatBubbleMessage>
                            </ChatBubble>
                            <ChatBubbleTimestamp className={"mx-11 text-gray-400"} timestamp={new Date(message.createdDate).toLocaleDateString("en-GB") + "  " + new Date(message.createdDate).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                                                 variant={user && user.id == message.sendById ? "send" : "received"}
                            />

                        </div>
                        /*eslint-disable-next-line react/jsx-no-comment-textnodes*/
                    ))
                        : (
                            <div className={"w-full flex flex-row justify-center items-center"}>
                                <Button className={"w-full mx-40 py-4"} disabled>
                                    <Loader2 className="animate-spin" />
                                    Đang xử lí
                                </Button>
                            </div>
                        )}

                </ChatMessageList>
            </div>

    );
};

export default ChatMessage;