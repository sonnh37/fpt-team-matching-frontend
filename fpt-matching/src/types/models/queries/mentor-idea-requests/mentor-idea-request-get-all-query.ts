import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { BaseQueryableQuery } from "../_base/base-query";

export interface MentorTopicRequestGetAllQuery extends BaseQueryableQuery {
  projectId?: string;
  ideaId?: string;
  status?: MentorTopicRequestStatus | null;
}
