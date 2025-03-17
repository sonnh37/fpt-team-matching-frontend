import { BaseEntity } from "./_base/base";
import { Feedback } from "./feedback";
import { Project } from "./project";
import { User } from "./user";

export interface Review extends BaseEntity {
    projectId?: string;
    number: number;
    description?: string;
    fileUpload?: string;
    expirationDate?: string; 
    reviewDate?: string; 
    room?: string;
    slot?: number;
    reviewer1Id?: string;
    reviewer2Id?: string;
    reviewer1?: User | null;
    reviewer2?: User | null;
    project?: Project | null;
    feedbacks?: Feedback[];
}