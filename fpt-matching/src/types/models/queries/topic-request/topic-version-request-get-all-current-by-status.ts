import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicVersionRequestGetAllCurrentByStatusQuery extends BaseQueryableQuery {
  status?: TopicVersionRequestStatus;
}
