import React, {useEffect, useState} from 'react';

const ConversationList = () => {
    interface partnerInfoResult {
        id: string;
        firstName: string;
        lastName: string;
    }
    interface lastMessage {
        senderId: string;
        content: string;
        createdDate: Date
        isSeen: boolean;
    }
    interface conversationMemberInfo {
        conversationId: string;
        id: string;
        partnerInfoResults: partnerInfoResult;
        lastMessageResult: lastMessage
    }
    const [conversations, setConversations] = useState<conversationMemberInfo[]>([]);
    useEffect(() => {
        fetch("http://localhost:5045/api/conversation-members/user/8220377b-3ebf-4847-a680-ec385a6094fc")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP errsor! Sstatus: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data.data);
                setConversations(data.data);
                return data.data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);
    return (
        <div className={"w-[25%] text-center bg-white"}>
            <div className={"w-full bg-amber-600 text-left pl-14 min-h-[10vh] leading-[5rem] font-bold text-lg text-white"}>
                Your conversation
            </div>
            <div className={""}>
                {conversations.map((conversation, index) => (
                    <div key={index} className={`min-h-16 border-[1px] border-gray-200 flex justify-between ${conversation.lastMessageResult ? conversation.lastMessageResult.isSeen ? "font-medium text-gray-500" : "font-bold bg-gray-200" : "font-medium"}`}>
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
                ))}
            </div>
        </div>
    );
};

export default ConversationList;