import { IdeaType } from "@/types/enums/idea";
import { CreateCommand, UpdateCommand } from "../_base/base-command";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";

export interface IdeaVersionRequestUpdateCommand extends UpdateCommand {
  ideaId?: string;
  reviewerId?: string;
  content?: string;
  status?: IdeaVersionRequestStatus;
  processDate?: string;
}
