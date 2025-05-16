import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { BaseQueryableQuery } from "../_base/base-query";
import { TopicStatus } from "@/types/enums/topic";

export interface TopicGetListByStatusAndRoleQuery extends BaseQueryableQuery {
  status?: TopicVersionRequestStatus;
  topicStatus?: TopicStatus;
  roles?: string[];
}
