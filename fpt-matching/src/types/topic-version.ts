import { TopicVersionStatus } from "./enums/topic-version";
import { TopicVersionRequest } from "./topic-version-request";
import {BaseEntity} from "@/types/_base/base";
import {Topic} from "@/types/topic";

export interface TopicVersion extends BaseEntity {
  topicId?: string;
  fileUpdate?: string;
  status?: TopicVersionStatus;
  comment?: string;
  reviewStage: number;
  topic?: Topic;
  topicVersionRequests: TopicVersionRequest[];
}
