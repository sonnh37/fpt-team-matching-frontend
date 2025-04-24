import React from 'react';
import {Button} from "@/components/ui/button";
import { ChatInput } from '../ui/chat/chat-input';

const ChatMessageInput = ({sendMessage} : {sendMessage: Function}) => {
    const [msg, setMsg] = React.useState<string | null>(null);
    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if(msg != null && msg != ""){
                    sendMessage(msg);
                    setMsg(null);
                }
            }}
                className="relative flex rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
            <ChatInput
                value={msg || ""}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center  pt-0">

                <Button
                    type="submit"
                    size="lg"
                    className="ml-auto gap-1.5 bg-black text-white hover:bg-white hover:text-black transition-all border-black border-[1px]"
                >
                    Gửi
                </Button>
            </div>
        </form>
    );
};

export default ChatMessageInput;