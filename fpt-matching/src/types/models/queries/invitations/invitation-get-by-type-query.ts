import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { BaseQueryableQuery } from "../_base/base-query";

export interface InvitationGetByTypeQuery extends BaseQueryableQuery {
    type?: InvitationType;
    status?: InvitationStatus;
    projectId?: string;
}