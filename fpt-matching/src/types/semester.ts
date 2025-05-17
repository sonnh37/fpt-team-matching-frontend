import { BaseEntity } from "./_base/base";
import { CriteriaForm } from "./criteria-form";
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
  onGoingDate?: Date | string;
  maxTeamSize?: number;
  minTeamSize?: number;
  numberOfTeam: number;
  limitTopicMentorOnly: number;
  limitTopicSubMentor: number;
  criteriaForm?: CriteriaForm;
  profileStudents: ProfileStudent[];
  stageIdeas: StageIdea[];
  timelines: Timeline[];
  userXRoles: UserXRole[];
}
