'use client';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import { useState} from 'react';

const SendMessageForm = ({sendMessage} : {sendMessage: any}) => {
    const[msg, setMessage] = useState('');
    return (
        <form onSubmit={e => {
            e.preventDefault();
            sendMessage(msg);
            setMessage('');
        }}>
            <input className={"m-2"}
                   placeholder={"Enter message"}
                   onChange={e => setMessage(e.target.value)}
                   value={msg}
            />
            <button type="submit">Send</button>
        </form>
    )
}
const MessageContainer = ({messages}: {messages: string[]}) => {
    return (
        <div>
            {messages.map((message, index) => (
                <table key={index}>
                    <tr key={index}>
                        <td className="text-red-500">{message}</td>
                    </tr>
                </table>
            ))}
        </div>
    )
}

const ChatRoom = ({messages, sendMessage} : {messages: string[], sendMessage: any}) => {
   return (
       <div>
           <div className={"p-5"}>
               <div className={""}>
                   <h2>Chat room</h2>
               </div>
               <div></div>
           </div>
           <div className={"p-5"}>
               <div>
                   <MessageContainer messages={messages} />
                   <SendMessageForm sendMessage={sendMessage} />
               </div>
           </div>
       </div>
   )
}
const WaitingRoom = ({joinChatRoom}: { joinChatRoom : any }) => {
    const [username, setUsername] = useState<string>();
    const [chatroom, setChatroom] = useState<string>();
    const [partner, setPartner] = useState<string>();
    return (
        <form onSubmit={e => {
            e.preventDefault();
            joinChatRoom(username, partner ,chatroom);
        }}>
            <div className={"p-5"}>
                <div>
                    <input placeholder={"UserId"} className={"text-red-500 m-5"}
                           onChange={e => setUsername(e.target.value)}/>
                    <input placeholder="ChatRoom" className={"text-red-500 m-5"}
                           onChange={e => setChatroom(e.target.value)}/>
                    <input placeholder="Partner" className={"text-red-500 m-5"}
                           onChange={e => setPartner(e.target.value)}/>
                </div>
                <button type={"submit"}>Submit</button>
            </div>
        </form>
    )
}
export default function Chat() {
    const [conn, setConnection] = useState<HubConnection>();
    const [messages, setMessages] = useState<string[]>([]);
    const joinChatRoom = async (username: string,  partnerId: string , chatroom: string) => {
        try {
            console.log(username);
            console.log(chatroom);
            console.log(partnerId);
            const conn = new HubConnectionBuilder()
                .withUrl(`http://localhost:5045/Chat`)
                .configureLogging(LogLevel.Information)
                .build();

            conn.on("JoinSpecificChatRoom", (username: string, msg: string) => {
                console.log("msg: ", msg)
                setMessages(messages => [...messages, msg]);
            })
            conn.on("ReceiveSpecificMessage",  (username: string, msg: string) => {
                console.log("ReceiveSpecificMessage", msg)
                setMessages(messages => [...messages, msg]);
            })
            await conn.start();
            await conn.invoke("JoinSpecificChatRoom", {UserId: username, PartnerId: partnerId, ConversationId: chatroom});
            setConnection(conn);
        } catch (e) {
            console.error(e);
        }
    }

    const sendMessage = async (message: string) => {
        try {
            await conn?.invoke("SendMessage", message)
        } catch (e : any) {
            console.error(e);
        }
    }
    return (
        <main>
            <div className={"m-5 p-5"}>
                <h1>Chat app</h1>
                {!conn
                ?  <WaitingRoom joinChatRoom={joinChatRoom}/>
                : <ChatRoom messages={messages} sendMessage={sendMessage} />}
            </div>
        </main>
    );
}

