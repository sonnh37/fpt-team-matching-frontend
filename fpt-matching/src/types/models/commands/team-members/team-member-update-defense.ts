import {UpdateCommand} from "@/types/models/commands/_base/base-command";
import {TeamMemberStatus} from "@/types/enums/team-member";

export interface TeamMemberUpdateDefenseCommand extends UpdateCommand {
    status?: TeamMemberStatus;
    commentDefense?:string;
}
