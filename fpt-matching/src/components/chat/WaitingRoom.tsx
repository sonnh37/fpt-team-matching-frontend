import {useState} from "react";

const WaitingRoom = ({joinChatRoom}: { joinChatRoom : any }) => {
    const [username, setUsername] = useState<string>();
    const [chatroom, setChatroom] = useState<string>();
    const [partner, setPartner] = useState<string>();
    return (
        <form onSubmit={e => {
            e.preventDefault();
            joinChatRoom(username, partner ,chatroom);
        }}
              className={"h-3/4"}>
            <div >
                <div>
                    <input placeholder={"UserId"} className={"text-red-500 m-5"}
                           onChange={e => setUsername(e.target.value)}/>
                    <input placeholder="ChatRoom" className={"text-red-500 m-5"}
                           onChange={e => setChatroom(e.target.value)}/>
                    <input placeholder="Partner" className={"text-red-500 m-5"}
                           onChange={e => setPartner(e.target.value)}/>
                </div>
                <button type={"submit"} className={"bg-green-600 rounded px-5 py-2"}>Submit</button>
            </div>
        </form>
    )
}
export default WaitingRoom;