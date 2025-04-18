import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { CreateCommand, UpdateCommand } from "../_base/base-command";

export interface MentorTopicRequestUpdateCommand extends UpdateCommand {
  projectId?: string;
  ideaId?: string;
  status?: MentorTopicRequestStatus;
}
