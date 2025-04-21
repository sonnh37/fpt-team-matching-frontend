import { IdeaStatus, IdeaType } from "@/types/enums/idea";
import { BaseEntity } from "./_base/base";
import { IdeaVersion } from "./idea-version";
import { Specialty } from "./specialty";
import { User } from "./user";

export interface Idea extends BaseEntity {
  ownerId?: string;
  mentorId?: string;
  subMentorId?: string;
  specialtyId?: string;
  type?: IdeaType;
  status?: IdeaStatus;
  isExistedTeam: boolean;
  isEnterpriseTopic: boolean;
  owner?: User;
  mentor?: User;
  subMentor?: User;
  specialty?: Specialty;
  ideaVersions: IdeaVersion[];
}
