import { TopicStatus } from "@/types/enums/topic";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicGetCurrentByStatusQuery extends BaseQueryableQuery {
  statusList: TopicStatus[];
}
