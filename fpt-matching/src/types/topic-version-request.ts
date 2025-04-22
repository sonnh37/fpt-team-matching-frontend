import { TopicVersionRequestStatus } from "./enums/topic-version-request";
import { TopicVersion } from "./topic-version";
import { User } from "./user";
import {BaseEntity} from "@/types/_base/base";

export interface TopicVersionRequest extends BaseEntity{
  topicVersionId?: string;
  reviewerId?: string;
  processDate?: Date | string;
  status?: TopicVersionRequestStatus;
  role?: string;
  topicVersion?: TopicVersion;
  reviewer?: User;
  feedback?: string;
}
