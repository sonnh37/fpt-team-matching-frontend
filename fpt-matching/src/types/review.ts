import { BaseEntity } from "./_base/base";
import { Feedback } from "./feedback";
import { Project } from "./project";

export interface Review extends BaseEntity {
    projectId?: string;
    number: number;
    description?: string;
    fileUpload?: string;
    reviewer1?: string;
    reviewer2?: string;
    project?: Project;
    feedbacks: Feedback[];
}