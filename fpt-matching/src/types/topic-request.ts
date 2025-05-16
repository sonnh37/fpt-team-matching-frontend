import { BaseEntity } from "@/types/_base/base";
import { TopicRequestStatus } from "./enums/topic-request";
import { Topic } from "./topic";
import { User } from "./user";
import { CriteriaForm } from "./criteria-form";
import { AnswerCriteria } from "@/types/answer-criteria";

export interface TopicRequest extends BaseEntity {
  topicId?: string;
  reviewerId?: string;
  criteriaFormId?: string;
  status?: TopicRequestStatus;
  processDate?: Date;
  role?: string;
  topic?: Topic;
  reviewer?: User;
  criteriaForm?: CriteriaForm;
  answerCriterias?: AnswerCriteria[];
}
