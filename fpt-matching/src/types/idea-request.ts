import { BaseEntity } from "./_base/base";
import { IdeaRequestStatus } from "./enums/idea-request";
import { Idea } from "./idea";
import { User } from "./user";

export interface IdeaRequest extends BaseEntity {
  ideaId?: string;
  reviewerId?: string;
  content?: string;
  status?: IdeaRequestStatus;
  processDate?: string;
  idea?: Idea;
  reviewer?: User;
}
