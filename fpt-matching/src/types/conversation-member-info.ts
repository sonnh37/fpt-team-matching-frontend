export interface ConversationMemberInfo {
    id: string,
    conversationId: string,
    partnerInfoResults: PartnerInfoResult
    lastMessageResult: LastMessageResult
}

export interface PartnerInfoResult {
    id: string,
    firstName: string,
    lastName: string,
}

export interface LastMessageResult {
    senderId: string,
    content: string,
    createdDate: string,
    isSeen: boolean
}