import { TopicRequestStatus } from "@/types/enums/topic-request";
import { UpdateCommand } from "../_base/base-command";

export interface TopicRequestMentorOrManagerResponseCommand
  extends UpdateCommand {
  status?: TopicRequestStatus;
}
