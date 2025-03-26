import { BaseEntity } from "./_base/base";
import { Semester } from "./semester";

export interface StageIdea extends BaseEntity {
    semesterId?: string;
    startDate?: string;
    endDate?: string;
    resultDate?: string;
    stageNumber: number;
    semester?: Semester | null;
}
