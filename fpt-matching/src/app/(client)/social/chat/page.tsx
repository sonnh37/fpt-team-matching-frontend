"use client";
import ConversationList from '@/components/chat/ConversationList';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import {useState} from "react";
import WaitingRoom from "@/components/chat/WaitingRoom";
import ChatRoom from '@/components/chat/ChatRoom';

export default function Page() {
  const [conn, setConnection] = useState<HubConnection>();
  const [messages, setMessages] = useState<string[]>([]);
  const joinChatRoom = async (username: string,  partnerId: string , chatroom: string) => {
    try {
      const conn = new HubConnectionBuilder()
          .withUrl(`http://localhost:5045/Chat`)
          .configureLogging(LogLevel.Information)
          .build();

      conn.on("JoinSpecificChatRoom", (username: string, msg: string) => {
        console.log("msg: ", msg)
      })
      conn.on("ReceiveSpecificMessage",  (username: string, msg: string) => {
        setMessages(messages => [...messages, msg]);
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
        <div className={"bg-blue-100 min-h-[100vh] text-black m-0 flex w-[100vw]"}>
          <ConversationList />
          <div className={"w-[75%] min-h-screen"}>
            {!conn
                ?  <WaitingRoom joinChatRoom={joinChatRoom}/>
                : <ChatRoom setMessage={setMessages} messages={messages} conn={conn}/>}
          </div>
        </div>
      </main>
  );
}
