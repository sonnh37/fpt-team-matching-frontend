import { ProjectStatus } from "@/types/enums/project";
import { BaseQueryableQuery } from "../_base/base-query";

export interface ProjectSearchQuery extends BaseQueryableQuery {
  leaderId?: string;
  topicId?: string;
  teamName?: string;
  teamCode?: string;
  description?: string;
  status?: ProjectStatus;
  teamSize?: number;

  isHasTeam: boolean;
  englishName?: string;
  specialtyId?: string;
  professionId?: string;
}
