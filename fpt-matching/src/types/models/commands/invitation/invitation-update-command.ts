import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { UpdateCommand } from "../_base/base-command";

export interface InvitationUpdateCommand extends UpdateCommand {
  projectId?: string;
  senderId?: string;
  receiverId?: string;
  status?: InvitationStatus;
  type?: InvitationType;
  content?: string;
}
