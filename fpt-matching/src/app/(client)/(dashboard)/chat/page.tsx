"use client";
import ConversationList from '@/components/chat/ConversationList';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import {useEffect, useState} from "react";
import WaitingRoom from "@/components/chat/WaitingRoom";
import ChatRoom from '@/components/chat/ChatRoom';
import {MessageModel} from "@/types/message-model";
import {ConversationMemberInfo} from "@/types/conversation-member-info";

export default function Page() {
  const [conn, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [loadMessage, setLoadMessage] = useState<boolean>(false);
  const [chatroom, setChatroom] = useState<ConversationMemberInfo>();
  const [toggle, setToggle] = useState<boolean>(false)

  const joinChatRoom = async (username: string,  partnerId: string , chatroom: string) => {
    try {
      const conn = new HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_API_BASE}/chat`)
          .configureLogging(LogLevel.Information)
          .build();

      conn.on("JoinSpecificChatRoom", (username: string, msg: string) => {
        console.log("msg: ", msg)
      })
      conn.on("ReceiveSpecificMessage",  (username: string, msg: string, conversationId: string) => {
        const newMessage : MessageModel = {
          content: msg,
          sendById: username,
          id: `msg_${Date.now().toString()}`,
          conversationId: conversationId,
          createdDate: new Date().toISOString()
        }
        setMessages(prevMessages => [...prevMessages, newMessage]);
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
        <div className={"text-black p-0 m-0 flex gap-12 h-[82vh] w-full"}>
          <ConversationList setToggle={setToggle} toggle={toggle} setLoadMessage={setLoadMessage} loadMessage={loadMessage} chatRoom={chatroom} setChatRoom={setChatroom} joinChatRoom={joinChatRoom} conn={conn} setConnection={setConnection} />
          <div className={"w-[90%]"}>
            {!conn
                ?  <WaitingRoom />
                : <ChatRoom setLoadMessage={setLoadMessage} loadMessage={loadMessage} chatRoom={chatroom} setMessages={setMessages} messages={messages} conn={conn}/>}
          </div>
        </div>
      </main>
  );
}
