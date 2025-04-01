import { MentorIdeaRequestStatus } from "@/types/enums/mentor-idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface MentorIdeaRequestGetAllQuery extends BaseQueryableQuery {
  projectId?: string;
  ideaId?: string;
  status?: MentorIdeaRequestStatus | null;
}
