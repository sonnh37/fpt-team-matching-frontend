import {BaseService} from "@/services/_base/base-service";
import {ConversationMember} from "@/types/conversation-member";
import axiosInstance from "@/lib/interceptors/axios-instance";
import {ConversationMemberInfo} from "@/types/conversation-member-info";
import {BusinessResult} from "@/types/models/responses/business-result";

class ConversationMemberService extends BaseService<ConversationMember>{
    constructor() {
        super("conversation-members");
    }

    public fetchConversationPartner = async (
        userId: string
    ): Promise<BusinessResult<ConversationMemberInfo[]>> => {
        try {
            const response = await axiosInstance.get<BusinessResult<ConversationMemberInfo[]>>(
                `${this.endpoint}/user/${userId}`,
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
            return Promise.reject(error);
        }
    };
}

export const conversationMemberService = new ConversationMemberService();