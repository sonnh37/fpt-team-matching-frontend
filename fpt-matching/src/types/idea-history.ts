import { BaseEntity } from "./_base/base";
import { IdeaRequestStatus } from "./enums/idea-request";
import { Idea } from "./idea";
import { IdeaHistoryRequest } from "./idea-history-request";
import { User } from "./user";

export interface IdeaHistory extends BaseEntity {
  ideaId?: string;
  councilId?: string;
  fileUpdate?: string;
  status?: IdeaRequestStatus;
  reviewStage: number;
  idea?: Idea;
  council?: User;
  ideaHistoryRequests: IdeaHistoryRequest[];
}
