import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { BaseQueryableQuery } from "../_base/base-query";
import { ProjectStatus } from "@/types/enums/project";
import { Topic } from "@/types/topic";

export interface ProjectGetAllQuery extends BaseQueryableQuery {
  leaderId?: string;
  topicId?: string;
  teamName?: string;
  teamCode?: string;
  description?: string;
  status?: ProjectStatus;
  teamSize?: number;

  topicId?: string;
  defenseStage?: number;

  isHasTeam: boolean;
  englishName?: string;
  specialtyId?: string;
  leaderEmail?: string;
  // leaderEmail?: string;
  professionId?: string;
}
