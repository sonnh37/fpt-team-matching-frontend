import { ProjectStatus } from "@/types/enums/project";
import { CreateCommand } from "../_base/base-command";

export interface ProjectCreateCommand extends CreateCommand {
  leaderId?: string;
  topicId?: string;
  teamName?: string;
  teamCode?: string;
  description?: string;
  status?: ProjectStatus;
  teamSize?: number;
}
