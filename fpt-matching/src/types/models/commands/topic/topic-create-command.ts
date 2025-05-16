import { TopicType } from "@/types/enums/topic";
import { CreateCommand } from "../_base/base-command";



export interface TopicCreateCommand extends CreateCommand {
  ownerId?: string;
  semesterId?: string;
  mentorId?: string;
  subMentorId?: string;
  topicCode?: string;
  specialtyId?: string;
  description?: string;
  abbreviations?: string;
  vietNamName?: string;
  englishName?: string;
  file?: string;
  isExistedTeam?: boolean;
  isEnterpriseTopic?: boolean;
  enterpriseName?: string;
  maxTeamSize?: number;
  }
  