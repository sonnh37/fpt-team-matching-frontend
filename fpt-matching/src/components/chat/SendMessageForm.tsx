﻿import {useState} from "react";
const SendMessageForm = ({sendMessage} : {sendMessage: any}) => {
    const[msg, setMessage] = useState('');
    return (
        <form onSubmit={e => {
            e.preventDefault();
            sendMessage(msg);
            setMessage('');
        }}>
            <div className={"flex h-[5vh]"}>
                <input className={"w-full text-lg border-[1px] border-gray-300 px-4"}
                       placeholder={"Enter message"}
                       onChange={e => setMessage(e.target.value)}
                       value={msg}
                />
                <button className={"p-4 bg-amber-600"} type="submit">Gửi</button>
            </div>
        </form>
    )
}

export default SendMessageForm;