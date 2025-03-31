import { ProjectStatus } from "@/types/enums/project";
import { CreateCommand } from "../_base/base-command";

export interface RateCreateCommand extends CreateCommand {
  rateById?: string;
  rateForId?: string;
  numOfStar?: number;
  content?: string;
}
