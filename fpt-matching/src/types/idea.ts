import { IdeaStatus, IdeaType } from "@/types/enums/idea";
import { BaseEntity } from "./_base/base";
import { User } from "./user";
import { Specialty } from "./specialty";
import { Project } from "./project";
import { IdeaRequest } from "./idea-request";
import { Semester } from "./semester";
import { IdeaHistory } from "./idea-history";
import { MentorIdeaRequest } from "./mentor-idea-request";

export interface Idea extends BaseEntity {
  ownerId?: string;
  semesterId?: string;
  mentorId?: string;
  subMentorId?: string;
  type?: IdeaType;
  specialtyId?: string;
  ideaCode?: string;
  description?: string;
  abbreviations?: string;
  vietNamName?: string;
  englishName?: string;
  file?: string;
  status?: IdeaStatus;
  isExistedTeam: boolean;
  isEnterpriseTopic: boolean;
  enterpriseName?: string;
  maxTeamSize?: number;
  owner?: User;
  mentor?: User;
  subMentor?: User;
  specialty?: Specialty;
  project?: Project;
  semester?: Semester;
  ideaRequests: IdeaRequest[];
  ideaHistories: IdeaHistory[];
  mentorIdeaRequests: MentorIdeaRequest[];
}
