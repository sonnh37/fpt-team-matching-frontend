import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaRequestGetAllCurrentByStatusAndRolesQuery extends BaseQueryableQuery {
  status?: IdeaRequestStatus;
  roles?: string[];
  stageNumber?: number;
}
