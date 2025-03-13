import { BaseEntity } from "./_base/base";
import { Idea } from "./idea";
import { ProfileStudent } from "./profile-student";

export interface Semester extends BaseEntity {
    semesterCode?: string;
    semesterName?: string;
    semesterPrefixName?: string;
    startDate?: string;
    endDate?: string;
    ideas: Idea[];
    profileStudents: ProfileStudent[];
}