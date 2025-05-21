import { TopicStatus, TopicType } from "@/types/enums/topic";
import { UpdateCommand } from "../_base/base-command";

export interface TopicUpdateCommand extends UpdateCommand {
  ownerId?: string;
  mentorId?: string;
  subMentorId?: string;
  specialtyId?: string;
  stageTopicId?: string;
  topicCode?: string;
  type?: TopicType;
  status?: TopicStatus;
  isExistedTeam: boolean;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  isEnterpriseTopic: boolean;
  enterpriseName?: string;
  fileUrl?: string;
  semesterId?: string;
}
