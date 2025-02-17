import { BaseEntity } from "./_base/base";
import { Idea } from "./idea";

export interface Semester extends BaseEntity {
    semesterCode?: string;
    semesterName?: string;
    startDate?: string;
    endDate?: string;
    ideas: Idea[];
}