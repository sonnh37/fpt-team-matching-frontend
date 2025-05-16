import { BaseEntity } from "./_base/base";
import { Semester } from "./semester";
import {Topic} from "@/types/topic";

export interface StageTopic extends BaseEntity {
  semesterId?: string;
  startDate: Date | string;
  endDate: Date | string;
  resultDate: Date | string;
  stageNumber: number;
  numberReviewer?: number;
  semester?: Semester;
  topics: Topic[];
}
