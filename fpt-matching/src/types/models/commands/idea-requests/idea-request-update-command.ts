import { IdeaType } from "@/types/enums/idea";
import { CreateCommand, UpdateCommand } from "../_base/base-command";
import { IdeaRequestStatus } from "@/types/enums/idea-request";

export interface IdeaRequestUpdateCommand extends UpdateCommand {
  ideaId?: string;
  reviewerId?: string;
  content?: string;
  status?: IdeaRequestStatus;
  processDate?: string;
}
