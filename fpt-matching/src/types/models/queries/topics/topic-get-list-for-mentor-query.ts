import { TopicStatus } from "@/types/enums/topic";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicGetListForMentorQuery extends BaseQueryableQuery {
  roles?: string[];
  statuses?: TopicStatus[];
  semesterId?: string;
}
