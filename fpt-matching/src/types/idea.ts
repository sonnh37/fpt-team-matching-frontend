import { IdeaStatus, IdeaType } from "@/types/enums/idea";
import { BaseEntity } from "./_base/base";
import { User } from "./user";
import { Specialty } from "./specialty";
import { Project } from "./project";
import { IdeaRequest } from "./idea-request";
import { Semester } from "./semester";
import { IdeaHistory } from "./idea-history";
import { MentorIdeaRequest } from "./mentor-idea-request";
import { StageIdea } from "./stage-idea";

export interface Idea extends BaseEntity {
  ownerId?: string;
  stageIdeaId?: string;
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
  stageIdea?: StageIdea;
  ideaRequests: IdeaRequest[];
  ideaHistories: IdeaHistory[];
  mentorIdeaRequests: MentorIdeaRequest[];
}
