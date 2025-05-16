import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicVersionRequestGetAllCurrentByStatusAndRolesQuery extends BaseQueryableQuery {
  status?: TopicVersionRequestStatus;
  roles?: string[];
  stageNumber?: number;
}
