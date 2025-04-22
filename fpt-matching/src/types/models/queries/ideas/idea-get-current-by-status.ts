import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { BaseQueryableQuery } from "../_base/base-query";
import { IdeaStatus } from "@/types/enums/idea";

export interface IdeaGetCurrentByStatusQuery extends BaseQueryableQuery {
  status?: IdeaStatus; 
}
