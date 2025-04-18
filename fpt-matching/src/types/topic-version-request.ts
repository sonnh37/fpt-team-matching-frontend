import { TopicVersionRequestStatus } from "./enums/topic-version-request";
import { TopicVersion } from "./topic-version";
import { User } from "./user";

export interface TopicVersionRequest {
  topicVersionId?: string;
  reviewerId?: string;
  processDate?: Date | string;
  status?: TopicVersionRequestStatus;
  role?: string;
  topicVersion?: TopicVersion;
  reviewer?: User;
}
