import { BaseEntity } from "./_base/base";
import { Criteria } from "./criteria";
import { IdeaVersionRequest } from "./idea-version-request";

export interface AnswerCriteria extends BaseEntity {
  ideaVersionRequestId?: string;
  criteriaId?: string;
  value?: string;
  ideaRequest?: IdeaVersionRequest;
  criteria?: Criteria;
}
