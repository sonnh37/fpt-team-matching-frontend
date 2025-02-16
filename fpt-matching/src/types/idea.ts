import { IdeaStatus, IdeaType } from "@/types/enums/idea";
import { BaseEntity } from "./_base/base";
import { User } from "./user";
import { Specialty } from "./specialty";
import { Project } from "./project";
import { IdeaReview } from "./idea-review";
import { Semester } from "./semester";

export interface Idea extends BaseEntity {
    userId?: string;
    semesterId?: string;
    subMentorId?: string;
    type?: IdeaType;
    specialtyId?: string;
    title?: string;
    ideaCode?: string;
    description?: string;
    abbreviations?: string;
    vietNamName?: string;
    englishName?: string;
    file?: string;
    status?: IdeaStatus;
    isExistedTeam: boolean;
    isEnterpriseTopic: boolean;
    enterpriseName: string;
    maxTeamSize?: number;
    user?: User;
    subMentor?: User;
    specialty?: Specialty;
    project?: Project;
    semester?: Semester;
    ideaReviews: IdeaReview[];
}