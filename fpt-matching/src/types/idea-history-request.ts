import { BaseEntity } from "./_base/base";
import { IdeaHistoryRequestStatus } from "./enums/idea-history-request";
import { IdeaHistory } from "./idea-history";
import { User } from "./user";

export interface IdeaHistoryRequest extends BaseEntity {
  ideaHistoryId?: string;
  reviewerId?: string;
  content?: string;
  status?: IdeaHistoryRequestStatus;
  processDate?: string;
  ideaHistory?: IdeaHistory;
  reviewer?: User;
}
