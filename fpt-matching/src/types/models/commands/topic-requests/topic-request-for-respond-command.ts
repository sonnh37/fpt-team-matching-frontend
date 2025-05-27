import { TopicRequestStatus } from "@/types/enums/topic-request";
import { UpdateCommand } from "../_base/base-command";

export interface TopicRequestForRespondCommand extends UpdateCommand {
  status?: TopicRequestStatus;
}
