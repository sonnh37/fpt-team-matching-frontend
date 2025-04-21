import { BaseEntity } from "./_base/base";
import { AnswerCriteria } from "./answer-criteria";
import { CriteriaForm } from "./criteria-form";
import { IdeaVersionRequestStatus } from "./enums/idea-version-request";
import { IdeaVersion } from "./idea-version";
import { User } from "./user";

export interface IdeaVersionRequest extends BaseEntity {
  ideaVersionId?: string;
  reviewerId?: string;
  criteriaFormId?: string;
  status?: IdeaVersionRequestStatus;
  role?: string;
  processDate?: Date | string;
  ideaVersion?: IdeaVersion;
  reviewer?: User;
  criteriaForm?: CriteriaForm;
  answerCriterias: AnswerCriteria[];
}
