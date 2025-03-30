import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { BaseQueryableQuery } from "../_base/base-query";
import { ProjectStatus } from "@/types/enums/project";
import { Idea } from "@/types/idea";

export interface ProjectGetAllQuery extends BaseQueryableQuery {
  leaderId?: string;
  ideaId?: string;
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
