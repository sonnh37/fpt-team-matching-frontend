import { TopicVersionStatus } from "./enums/topic-version";
import { Topic } from "./topic";
import { TopicVersionRequest } from "./topic-version-request";

export interface TopicVersion {
  topicId?: string;
  fileUpdate?: string;
  status?: TopicVersionStatus;
  comment?: string;
  reviewStage: number;
  topic?: Topic;
  topicVersionRequests: TopicVersionRequest[];
}
