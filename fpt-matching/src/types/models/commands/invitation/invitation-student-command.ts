
import { CreateCommand } from "../_base/base-command";
export interface InvitationStudentCreatePendingCommand extends CreateCommand {
    projectId?: string;
    content?: string;
}