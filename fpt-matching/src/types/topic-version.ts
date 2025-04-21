import { TopicVersionStatus } from "./enums/topic-version";
import { Topic } from "./topic";
import { TopicVersionRequest } from "./topic-version-request";
import {BaseEntity} from "@/types/_base/base";

export interface TopicVersion extends BaseEntity {
  topicId?: string;
  fileUpdate?: string;
  status?: TopicVersionStatus;
  comment?: string;
  reviewStage: number;
  topic?: Topic;
  topicVersionRequests: TopicVersionRequest[];
}
