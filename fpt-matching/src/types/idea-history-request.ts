import { BaseEntity } from "./_base/base";
import { TopicHistoryRequestStatus } from "./enums/topic-history-request";
import { TopicHistory } from "./topic-history";
import { User } from "./user";

export interface TopicHistoryRequest extends BaseEntity {
  topicHistoryId?: string;
  reviewerId?: string;
  content?: string;
  status?: TopicHistoryRequestStatus;
  processDate?: string;
  topicHistory?: TopicHistory;
  reviewer?: User;
}
