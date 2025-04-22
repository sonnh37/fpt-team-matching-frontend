import { IdeaType } from "@/types/enums/idea";
import { CreateCommand, UpdateCommand } from "../_base/base-command";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";

export interface IdeaVersionRequestUpdateStatusCommand extends UpdateCommand {
  status?: IdeaVersionRequestStatus;
  answerCriteriaList?: AnswerCriteriaForLecturerRespond[];
}

interface AnswerCriteriaForLecturerRespond {
  criteriaId?: string; 
  value?: string;
}