import { BaseEntity } from "./_base/base";
import { IdeaVersion } from "./idea-version";
import { Semester } from "./semester";

export interface StageIdea extends BaseEntity {
  semesterId?: string;
  startDate: Date | string;
  endDate: Date | string;
  resultDate: Date | string;
  stageNumber: number;
  numberReviewer?: number;
  semester?: Semester;
  ideaVersions: IdeaVersion[];
}
