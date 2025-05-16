import { TopicStatus, TopicType } from "@/types/enums/topic";
import { BaseQueryableQuery } from "../_base/base-query";

export interface SemesterGetAllQuery extends BaseQueryableQuery {
  semesterCode?: string;
  semesterName?: string;
  semesterPrefixName?: string;
  startDate?: string;
  endDate?: string;
}
