import { MentorTopicRequestStatus } from "@/types/enums/mentor-topic-request";
import { CreateCommand, UpdateCommand } from "../_base/base-command";

export interface MentorTopicRequestUpdateCommand extends UpdateCommand {
  projectId?: string;
  topicId?: string;
  status?: MentorTopicRequestStatus;
}
