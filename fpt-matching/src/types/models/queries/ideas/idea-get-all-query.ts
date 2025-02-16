import { IdeaType, IdeaStatus } from "@/types/enums/idea";
import { BaseQueryableQuery } from "../_base/base-query";

export interface IdeaGetAllQuery extends BaseQueryableQuery {
  userId?: string;
  semesterId?: string;
  subMentorId?: string;
  type?: IdeaType;
  specialtyId?: string;
  title?: string;
  ideaCode?: string;
  description?: string;
  abbreviations?: string;
  vietNamName?: string;
  englishName?: string;
  file?: string;
  status?: IdeaStatus;
  isExistedTeam?: boolean;
  isEnterpriseTopic?: boolean;
  enterpriseName?: string;
  maxTeamSize?: number;
}
