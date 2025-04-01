import { MentorIdeaRequestStatus } from "@/types/enums/mentor-idea-request";
import { CreateCommand, UpdateCommand } from "../_base/base-command";

export interface MentorIdeaRequestUpdateCommand extends UpdateCommand {
  projectId?: string;
  ideaId?: string;
  status?: MentorIdeaRequestStatus;
}
