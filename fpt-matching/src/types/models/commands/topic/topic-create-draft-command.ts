import { CreateCommand } from "../_base/base-command";

export interface TopicCreateDraftCommand extends CreateCommand {
  specialtyId?: string;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  isEnterpriseTopic: boolean;
  enterpriseName?: string;
  fileUrl?: string;
}
