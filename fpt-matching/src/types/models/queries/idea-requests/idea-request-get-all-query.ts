import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaRequestGetAllQuery extends BaseQueryableQuery {
  ideaId?: string;
  reviewerId?: string;
  content?: string;
  status?: IdeaRequestStatus;
  processDate?: string;
}
