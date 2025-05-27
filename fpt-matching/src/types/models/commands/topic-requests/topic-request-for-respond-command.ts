import { TopicRequestStatus } from "@/types/enums/topic-request";

export interface TopicRequestForRespondCommand {
  status?: TopicRequestStatus;
}
