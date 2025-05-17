import { TopicType, TopicStatus } from "@/types/enums/topic";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicGetListOfSupervisorsQuery extends BaseQueryableQuery {
  ownerId?: string;
  semesterId?: string;
  mentorId?: string;
  subMentorId?: string;
  types: TopicType[];
  specialtyId?: string;
  topicCode?: string;
  description?: string;
  abbreviations?: string;
  vietNamName?: string;
  englishName?: string;
  file?: string;
  status?: TopicStatus;
  isExistedTeam?: boolean;
  isEnterpriseTopic?: boolean;
  enterpriseName?: string;
  maxTeamSize?: number;

  professionId?: string;
  role?: string;
}
