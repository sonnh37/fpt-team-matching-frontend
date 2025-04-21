import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaVersionRequestGetAllQuery extends BaseQueryableQuery {
  ideaId?: string;
  reviewerId?: string;
  content?: string;
  status?: IdeaVersionRequestStatus;
  processDate?: string;
}
