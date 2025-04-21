import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaVersionRequestGetAllCurrentByStatusQuery extends BaseQueryableQuery {
  status?: IdeaVersionRequestStatus;
}
