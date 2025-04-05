import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { BaseQueryableQuery } from "../_base/base-query";

export interface InvitationGetByStatudQuery extends BaseQueryableQuery {
    status?: InvitationStatus;
    projectId?: string;
}