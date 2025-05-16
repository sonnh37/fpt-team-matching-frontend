import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicVersionRequestGetAllQuery extends BaseQueryableQuery {
  topicId?: string;
  reviewerId?: string;
  content?: string;
  status?: TopicVersionRequestStatus;
  processDate?: string;
}
