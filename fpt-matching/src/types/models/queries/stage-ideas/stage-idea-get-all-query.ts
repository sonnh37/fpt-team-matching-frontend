import { TopicVersionRequestStatus } from "@/types/enums/topic-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface StageTopicGetAllQuery extends BaseQueryableQuery {
  semesterId?: string;
  startDate?: string;
  endDate?: string;
  resultDate?: string;
  stageNumber?: number;
}
