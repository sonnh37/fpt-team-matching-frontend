import { MentorTopicRequestStatus } from "@/types/enums/mentor-topic-request";
import { CreateCommand } from "../_base/base-command";

export interface MentorTopicRequestCreateCommand extends CreateCommand {
  projectId?: string;
  topicId?: string;
  status?: MentorTopicRequestStatus;
}
