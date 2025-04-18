import { BaseEntity } from "./_base/base";
import { CriteriaForm } from "./criteria-form";
import { Idea } from "./idea";
import { ProfileStudent } from "./profile-student";
import { StageIdea } from "./stage-idea";
import { Timeline } from "./timeline";
import { UserXRole } from "./user-x-role";

export interface Semester extends BaseEntity {
  criteriaFormId?: string;
  semesterCode?: string;
  semesterName?: string;
  semesterPrefixName?: string;
  publicTopicDate?: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  criteriaForm?: CriteriaForm;
  profileStudents: ProfileStudent[];
  stageIdeas: StageIdea[];
  timelines: Timeline[];
  userXRoles: UserXRole[];
}
