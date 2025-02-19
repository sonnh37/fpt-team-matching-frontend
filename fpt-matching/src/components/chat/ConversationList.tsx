import React, {useEffect, useState} from 'react';
import {conversationMemberService} from "@/services/conversation-member-service";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {ConversationMemberInfo} from "@/types/conversation-member-info";

const ConversationList = ({joinChatRoom, setChatRoom, chatRoom}: { joinChatRoom : any, setChatRoom: any, chatRoom: string | undefined}) => {
    const [partner, setPartner] = useState<string>();


    const user = useSelector((state: RootState)=> state.user.user)
    if (!user) {
        throw new Error('No user found.');
    }
    const [conversations, setConversations] = useState<ConversationMemberInfo[] | undefined>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await conversationMemberService.fetchConversationPartner(user.id ? user.id : "");
                setConversations(data.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // username: string,  partnerId: string , chatroom: string
        if(chatRoom != null)
            joinChatRoom(user.id, null, chatRoom)
    }, [chatRoom]);
    return (
        <div className={"w-[25%] h-screen text-center bg-white"}>
            <div className={"w-full bg-amber-600 text-left pl-14 min-h-[10vh] leading-[5rem] font-bold text-lg text-white"}>
                Your conversation
            </div>
            <div className={""}>
                {conversations != undefined ? conversations.map((conversation, index) => (
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            setChatRoom(conversation.conversationId);
                        }}
                        key={index}
                         className={`hover:cursor-pointer min-h-16 border-[1px] border-gray-200 flex justify-between
                          ${conversation.lastMessageResult 
                             ? conversation.lastMessageResult.isSeen || conversation.lastMessageResult.senderId === user.id
                             ? "font-medium text-gray-500" 
                             : "font-bold bg-gray-200" 
                             : "font-medium"}`}>
                        <div className={"flex items-center"}>
                            <div className={"w-12 h-12 rounded-full bg-green-600 mx-2"}></div>
                            <div className={"h-full  flex flex-col justify-center text-left"}>
                                <div className={"w-[100%] font-bold text-black"}>
                                    {conversation.partnerInfoResults.firstName}{conversation.partnerInfoResults.lastName}
                                </div>
                                <div className={"text-xs"}>
                                    {conversation.lastMessageResult ? conversation.lastMessageResult.content : ""}
                                </div>
                            </div>
                        </div>
                        <div className={"text-sm mt-4 mr-2"}>
                            {conversation.lastMessageResult ? new Date(conversation.lastMessageResult.createdDate).toLocaleString() : ""}
                        </div>
                    </div>
                )) : ""}
            </div>
        </div>
    );
};

export default ConversationList;