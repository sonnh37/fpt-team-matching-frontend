import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaRequestGetAllCurrentByStatusQuery extends BaseQueryableQuery {
  status?: IdeaRequestStatus;
}
