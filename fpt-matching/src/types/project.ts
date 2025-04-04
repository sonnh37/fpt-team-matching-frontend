import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { CapstoneSchedule } from "./capstone-schedule";
import { ProjectStatus } from "./enums/project";
import { Idea } from "./idea";
import { Invitation } from "./invitation";
import { MentorIdeaRequest } from "./mentor-idea-request";
import { Review } from "./review";
import { TeamMember } from "./team-member";
import { User } from "./user";
import {MentorFeedback} from "@/types/mentor-feedback";

export interface Project extends BaseEntity {
  leaderId?: string;
  ideaId?: string;
  teamName?: string;
  teamCode?: string;
  description?: string;
  status?: ProjectStatus;
  teamSize?: number;
  leader?: User;
  idea?: Idea;
  invitations: Invitation[];
  reviews: Review[];
  teamMembers: TeamMember[];
  blogs: Blog[]
  mentorIdeaRequests: MentorIdeaRequest[];
  capstoneSchedules: CapstoneSchedule[];
  mentorFeedBack: MentorFeedback | null;
}
