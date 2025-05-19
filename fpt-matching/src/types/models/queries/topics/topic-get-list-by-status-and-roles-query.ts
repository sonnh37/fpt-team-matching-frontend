
import { TopicVersionRequestStatus } from "@/types/enums/topic-version-request";
import { BaseQueryableQuery } from "../_base/base-query";
import { TopicStatus } from "@/types/enums/topic";
import { TopicRequestStatus } from "@/types/enums/topic-request";

export interface TopicGetListByStatusAndRoleQuery extends BaseQueryableQuery {
  status?: TopicRequestStatus;
  topicStatus?: TopicStatus;
  roles?: string[];
}
