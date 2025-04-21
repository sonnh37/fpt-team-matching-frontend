import { IdeaType } from "@/types/enums/idea";
import { CreateCommand, UpdateCommand } from "../_base/base-command";
import { IdeaVersionRequestStatus } from "@/types/enums/idea-version-request";

export interface IdeaVersionRequestUpdateStatusCommand extends UpdateCommand {
  ideaId?: string;
  status?: IdeaVersionRequestStatus;
  content?: string;
}
