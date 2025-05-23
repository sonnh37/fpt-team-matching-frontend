import { TopicType, TopicStatus } from "@/types/enums/topic";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicGetAllQuery extends BaseQueryableQuery {
   ownerId?: string;
  mentorId?: string;
  subMentorId?: string;
  specialtyId?: string;
  stageTopicId?: string;
  semesterId?: string;
  topicCode?: string;
  type?: TopicType;
  status?: TopicStatus;
  isExistedTeam?: boolean;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  isEnterpriseTopic?: boolean;
  enterpriseName?: string;
  fileUrl?: string;
}
