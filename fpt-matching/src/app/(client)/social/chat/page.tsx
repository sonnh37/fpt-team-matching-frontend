"use client";
import ConversationList from '@/components/chat/ConversationList';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import {useState} from "react";
import WaitingRoom from "@/components/chat/WaitingRoom";
import ChatRoom from '@/components/chat/ChatRoom';
import {MessageModel} from "@/types/message-model";
import {ConversationMemberInfo} from "@/types/conversation-member-info";

export default function Page() {
  const [conn, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [chatroom, setChatroom] = useState<ConversationMemberInfo>();

  const joinChatRoom = async (username: string,  partnerId: string , chatroom: string) => {
    try {
      const conn = new HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_API_BASE}/Chat`)
          .configureLogging(LogLevel.Information)
          .build();

      conn.on("JoinSpecificChatRoom", (username: string, msg: string) => {
        console.log("msg: ", msg)
      })
      conn.on("ReceiveSpecificMessage",  (username: string, msg: string, conversationId: string) => {
        const newMessage : MessageModel = {
          content: msg,
          sendById: username,
          id: "",
          conversationId: conversationId,
          createdDate: Date.now().toString()
        }
        setMessages(messages => [...messages, newMessage]);
      })
      await conn.start();
      await conn.invoke("JoinSpecificChatRoom", {UserId: username, PartnerId: partnerId, ConversationId: chatroom});
      setConnection(conn);
    } catch (e) {
      console.error(e);
    }
  }
  return (
      <main>
        <div className={"bg-blue-100 text-black p-0 m-0 flex w-full"}>
          <ConversationList chatRoom={chatroom} setChatRoom={setChatroom} joinChatRoom={joinChatRoom} />
          <div className={"w-[75%] "}>
            {!conn
                ?  <WaitingRoom />
                : <ChatRoom chatRoom={chatroom} setMessages={setMessages} messages={messages} conn={conn}/>}
          </div>
        </div>
      </main>
  );
}
