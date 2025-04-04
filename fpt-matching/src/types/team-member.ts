import { BaseEntity } from "./_base/base";
import {MentorConclusionOptions, TeamMemberRole, TeamMemberStatus} from "./enums/team-member";
import { Project } from "./project";
import { Rate } from "./rate";
import { User } from "./user";

export interface TeamMember extends BaseEntity {
    userId?: string;
    projectId?: string;
    role?: TeamMemberRole;
    joinDate?: string;
    leaveDate?: string;
    status?: TeamMemberStatus;
    mentorConclusion? : MentorConclusionOptions;
    attitude? :string;
    project?: Project;
    user?: User;
    rateBys: Rate[];
    rateFors: Rate[];
}