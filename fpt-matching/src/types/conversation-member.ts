import {BaseEntity} from "@/types/_base/base";

export interface ConversationMember extends BaseEntity {
    userId: string | null | undefined;
    conversationId: string | null | undefined;
}