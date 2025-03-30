import { MentorIdeaRequestStatus } from "@/types/enums/mentor-idea-request";
import { CreateCommand } from "../_base/base-command";

export interface MentorIdeaRequestCreateCommand extends CreateCommand {
  projectId?: string;
  ideaId?: string;
  status?: MentorIdeaRequestStatus;
}
