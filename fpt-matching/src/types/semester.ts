import { BaseEntity } from "./_base/base";
import { CriteriaForm } from "./criteria-form";
import { SemesterStatus } from "./enums/semester";
import { ProfileStudent } from "./profile-student";
import { Project } from "./project";
import { StageTopic } from "./stage-topic";
import { UserXRole } from "./user-x-role";

export interface Semester extends BaseEntity {
  criteriaFormId?: string;
  semesterCode?: string;
  semesterName?: string;
  semesterPrefixName?: string;
  startDate?: Date;
  endDate?: Date;
  onGoingDate?: Date;
  publicTopicDate?: Date;
  status: SemesterStatus;
  maxTeamSize: number;
  minTeamSize: number;
  numberOfTeam: number;
  limitTopicMentorOnly: number;
  limitTopicSubMentor: number;
  criteriaForm?: CriteriaForm;
  profileStudents?: ProfileStudent[];
  stageTopics?: StageTopic[];
  userXRoles?: UserXRole[];
  projects?: Project[];
}
