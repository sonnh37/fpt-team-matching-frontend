import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface StageIdeaGetAllQuery extends BaseQueryableQuery {
  semesterId?: string;
  startDate?: string;
  endDate?: string;
  resultDate?: string;
  stageNumber?: number;
}
