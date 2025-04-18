import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { CreateCommand } from "../_base/base-command";

export interface MentorTopicRequestCreateCommand extends CreateCommand {
  projectId?: string;
  ideaId?: string;
  status?: MentorTopicRequestStatus;
}
