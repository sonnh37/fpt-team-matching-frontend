
import { CreateCommand } from "../_base/base-command";
export interface InvitationTeamCreatePendingCommand extends CreateCommand {
    projectId?: string;
    receiverId?: string;
    content?: string;
}