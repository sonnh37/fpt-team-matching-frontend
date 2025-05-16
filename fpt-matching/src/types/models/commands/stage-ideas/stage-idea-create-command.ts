import { CreateCommand } from "../_base/base-command";

export interface StageTopicCreateCommand extends CreateCommand {
  semesterId?: string;
  startDate?: string;
  endDate?: string;
  resultDate?: string;
  stageNumber?: number;
}
