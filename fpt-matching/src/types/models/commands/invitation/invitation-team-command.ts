
import { CreateCommand } from "../_base/base-command";
export interface TeamInvitationCommand extends CreateCommand {
    projectId?: string;
    receiverId?: string;
    content?: string;
}