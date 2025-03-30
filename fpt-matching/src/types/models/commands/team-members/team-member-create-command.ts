import { TeamMemberRole, TeamMemberStatus } from "@/types/enums/team-member";
import { CreateCommand } from "../_base/base-command";

export interface TeamMemberCreateCommand extends CreateCommand {
  userId?: string;
  projectId?: string;
  role?: TeamMemberRole;
  joinDate?: string;
  leaveDate?: string;
  status?: TeamMemberStatus;
}
