import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { ProjectStatus } from "./enums/project";
import { Idea } from "./idea";
import { Invitation } from "./invitation";
import { Review } from "./review";
import { TeamMember } from "./team-member";
import { User } from "./user";

export interface Project extends BaseEntity {
  leaderId?: string;
  ideaId?: string;
  teamName?: string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  teamSize?: number;
  startDate?: string;
  endDate?: string;
  leader?: User;
  idea?: Idea;
  invitations: Invitation[];
  reviews: Review[];
  teamMembers: TeamMember[];
  blogs: Blog[]
}
