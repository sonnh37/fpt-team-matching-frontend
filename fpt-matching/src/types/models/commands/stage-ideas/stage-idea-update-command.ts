import { UpdateCommand } from "../_base/base-command";

export interface StageIdeaUpdateCommand extends UpdateCommand {
  semesterId?: string | null | undefined;
  startDate?: string | null | undefined;
  endDate?: string | null | undefined;
  resultDate?: string | null | undefined;
  stageNumber?: number ;
}
