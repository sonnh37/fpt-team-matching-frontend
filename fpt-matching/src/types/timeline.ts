import { TimelineType } from "./enums/timeline";
import { Semester } from "./semester";

export interface Timeline {
  semesterId?: string;
  title?: TimelineType;
  startDate?: Date | string; 
  endDate?: Date | string;
  semester?: Semester;
}
