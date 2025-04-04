import { BaseEntity } from "./_base/base";
import { Project } from "./project";

export interface MentorFeedback extends BaseEntity {
    projectId?: string;
    thesisContent?: string;
    thesisForm?: string;
    achievementLevel?: string;
    limitation? :string;
    project? :Project | null;
}