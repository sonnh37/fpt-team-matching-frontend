import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { BaseQueryableQuery } from "../_base/base-query";

export interface InvitationGetAllQuery extends BaseQueryableQuery {
  projectId?: string;
  senderId?: string;
  receiverId?: string;
  status?: InvitationStatus;
  type?: InvitationType;
  content?: string;
}
