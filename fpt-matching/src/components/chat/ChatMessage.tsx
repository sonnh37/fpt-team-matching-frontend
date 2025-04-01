import React from 'react';
import { ChatMessageList } from '../ui/chat/chat-message-list';
import {ChatBubble, ChatBubbleAvatar, ChatBubbleMessage} from '../ui/chat/chat-bubble';
import {MessageModel} from "@/types/message-model";
import {useSelectorUser} from "@/hooks/use-auth";

const ChatMessage = ({messages} : {messages:MessageModel[]}) => {
    const user = useSelectorUser()
    return (
            // Wrap with ChatMessageList
            <div className={""}>
               {/*eslint-disable-next-line react/jsx-no-comment-textnodes*/}
                <ChatMessageList className={""}>
                    {messages.map((message, index) => (
                        <ChatBubble key={index} variant={user && user.id == message.sendById ? "sent" : "received"}>
                            <ChatBubbleAvatar fallback='US' />
                            <ChatBubbleMessage variant='sent'>
                                {message.content}
                            </ChatBubbleMessage>
                        </ChatBubble>
                    /*eslint-disable-next-line react/jsx-no-comment-textnodes*/
                    ))}
                </ChatMessageList>
            </div>

    );
};

export default ChatMessage;