import { IdeaStatus } from "@/types/enums/idea";
import { UpdateCommand } from "../_base/base-command";

export interface IdeaVersionCreateForResubmit extends UpdateCommand {
  ideaId?: string;
  stageIdeaId?: string;
  version?: number;
  enterpriseName?: string;
  teamSize?: number;
  file?: string;
  vietNamName?: string;
  description?: string;
  abbreviations?: string;
  englishName?: string;
}
