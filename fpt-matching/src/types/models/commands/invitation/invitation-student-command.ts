
import { CreateCommand } from "../_base/base-command";
export interface StudentInvitationCommand extends CreateCommand {
    projectId?: string;
    content?: string;
}