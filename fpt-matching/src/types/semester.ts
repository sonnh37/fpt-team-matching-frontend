import { BaseEntity } from "./_base/base";
import { Idea } from "./idea";
import { ProfileStudent } from "./profile-student";
import { StageIdea } from "./stage-idea";

export interface Semester extends BaseEntity {
    semesterCode?: string;
    semesterName?: string;
    semesterPrefixName?: string;
    startDate?: string;
    endDate?: string;
    stageIdeas: StageIdea[];
    profileStudents: ProfileStudent[];
}