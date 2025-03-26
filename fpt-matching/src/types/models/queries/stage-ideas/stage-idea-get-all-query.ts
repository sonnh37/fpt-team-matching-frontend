import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface StageIdeaGetAllQuery extends BaseQueryableQuery {
  semesterId?: string;
  startDate?: string;
  endDate?: string;
  resultDate?: string;
  stageNumber?: number;
}
