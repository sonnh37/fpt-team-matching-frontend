import { ProjectStatus } from "@/types/enums/project";
import { CreateCommand } from "../_base/base-command";

export interface TeamCreateCommand extends CreateCommand {
  teamName?: string;
  teamSize?: number;
}
