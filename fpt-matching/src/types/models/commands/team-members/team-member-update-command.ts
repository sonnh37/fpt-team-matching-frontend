import { TeamMemberRole, TeamMemberStatus } from "@/types/enums/team-member";
import { UpdateCommand } from "../_base/base-command";

export interface TeamMemberUpdateCommand extends UpdateCommand {
  userId?: string;
  projectId?: string;
  role?: TeamMemberRole;
  joinDate?: string;
  leaveDate?: string;
  status?: TeamMemberStatus;
}
