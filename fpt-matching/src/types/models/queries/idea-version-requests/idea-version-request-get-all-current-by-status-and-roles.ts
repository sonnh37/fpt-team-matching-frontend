import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaVersionRequestGetAllCurrentByStatusAndRolesQuery extends BaseQueryableQuery {
  status?: IdeaVersionRequestStatus;
  roles?: string[];
  stageNumber?: number;
}
