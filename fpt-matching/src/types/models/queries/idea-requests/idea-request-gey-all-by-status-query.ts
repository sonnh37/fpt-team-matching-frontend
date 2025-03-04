import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaRequestGetAllByStatusQuery extends BaseQueryableQuery {
  ideaId?: string;
  statusList?: IdeaRequestStatus[];
}
