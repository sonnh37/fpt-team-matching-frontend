import { IdeaRequestStatus } from "@/types/enums/idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaRequestGetAllByListStatusForCurrentUser extends BaseQueryableQuery {
  statusList?: IdeaRequestStatus[];
}
