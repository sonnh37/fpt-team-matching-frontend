import { ProjectStatus } from "@/types/enums/project";
import { UpdateCommand } from "../_base/base-command";

export interface ProjectUpdateCommand extends UpdateCommand {
  leaderId?: string;
  topicId?: string;
  teamName?: string;
  teamCode?: string;
  description?: string;
  status?: ProjectStatus;
  teamSize?: number;
}
