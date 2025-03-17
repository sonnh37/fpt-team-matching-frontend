import { IdeaType } from "@/types/enums/idea";
import { CreateCommand, UpdateCommand } from "../_base/base-command";
import { IdeaRequestStatus } from "@/types/enums/idea-request";

export interface IdeaRequestUpdateStatusCommand extends UpdateCommand {
  ideaId?: string;
  status?: IdeaRequestStatus;
  content?: string;
}
