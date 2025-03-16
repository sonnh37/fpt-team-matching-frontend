import { Semester } from "./semester";

export interface StageIdea {
    semesterId?: string;
    startDate: string;
    endDate: string;
    resultDate: string;
    semester?: Semester | null;
}
