import {BaseService} from "@/services/_base/base-service";
import {MessageModel} from "@/types/message-model";
import {BusinessResult} from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";

class MessageService extends BaseService<MessageModel>{
    constructor() {
        super("message");
    }
    public getMessageInDay = async (
        conversationId: string
    ): Promise<BusinessResult<MessageModel[]>> => {
        try {
            const response = await axiosInstance.get<BusinessResult<MessageModel[]>>(
                `${this.endpoint}/daily/${conversationId}`,
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
            return Promise.reject(error);
        }
    };

    public getMessageByConversationId = async (
        conversationId: string,
        pageSize: number,
        pageNumber: number
    ): Promise<BusinessResult<MessageModel[]>> => {
        try {
            const response = await axiosInstance.get<BusinessResult<MessageModel[]>>(
                `${this.endpoint}?ConversationId=${conversationId}&PageSize=${pageSize}&PageNumber=${pageNumber}`,
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
            return Promise.reject(error);
        }
    };

}

export const messageService = new MessageService();