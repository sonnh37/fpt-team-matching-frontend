import { BaseEntity } from "./_base/base";
import { Criteria } from "./criteria";
import { TopicVersionRequest } from "./topic-version-request";

export interface AnswerCriteria extends BaseEntity {
  topicVersionRequestId?: string;
  criteriaId?: string;
  value?: string;
  topicVersionRequest?: TopicVersionRequest;
  criteria?: Criteria;
}
