import { BaseEntity } from "./_base/base";
import { Idea } from "./idea";
import { User } from "./user";

export interface IdeaReview extends BaseEntity {
    ideaId?: string;
    reviewerId?: string;
    processDate?: string;
    idea?: Idea;
    reviewer?: User;
}
