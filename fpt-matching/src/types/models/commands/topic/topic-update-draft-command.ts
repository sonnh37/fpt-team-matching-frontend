import { TopicStatus, TopicType } from "@/types/enums/topic";
import { UpdateCommand } from "../_base/base-command";

export interface TopicUpdateDraftCommand extends UpdateCommand {
  specialtyId?: string;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  isEnterpriseTopic: boolean;
  enterpriseName?: string;
  fileUrl?: string;
}
