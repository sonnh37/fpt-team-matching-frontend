import { IdeaType } from "@/types/enums/idea";
import { CreateCommand } from "../_base/base-command";



export interface IdeaCreateCommand extends CreateCommand {
  ownerId?: string;
  semesterId?: string;
  mentorId?: string;
  subMentorId?: string;
  specialtyId?: string;
  description?: string;
  abbreviations?: string;
  vietNamName?: string;
  englishName?: string;
  file?: string;
  isExistedTeam: boolean;
  isEnterpriseTopic: boolean;
  enterpriseName?: string;
  maxTeamSize?: number;
  }
  