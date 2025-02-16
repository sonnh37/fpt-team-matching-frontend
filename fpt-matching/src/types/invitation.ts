import { BaseEntity } from "./_base/base";
import { InvitationStatus, InvitationType } from "./enums/invitation";
import { Project } from "./project";
import { User } from "./user";

export interface Invitation extends BaseEntity {
    projectId?: string;
    senderId?: string;
    receiverId?: string;
    status?: InvitationStatus;
    type?: InvitationType;
    content?: string;
    project?: Project;
    sender?: User;
    receiver?: User;
}