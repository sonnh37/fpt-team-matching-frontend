import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { CapstoneSchedule } from "./capstone-schedule";
import { ProjectStatus } from "./enums/project";
import { Idea } from "./idea";
import { Invitation } from "./invitation";
import { MentorTopicRequest } from "./mentor-topic-request";
import { Review } from "./review";
import { TeamMember } from "./team-member";
import { Topic } from "./topic";
import { User } from "./user";

export interface Project extends BaseEntity {
  leaderId?: string;
  topicId?: string;
  teamName?: string;
  teamCode?: string;
  // description?: string;
  status?: ProjectStatus;
  teamSize?: number;
  leader?: User;
  idea?: Idea;
  invitations: Invitation[];
  reviews: Review[];
  teamMembers: TeamMember[];
  blogs: Blog[]
  mentorTopicRequests: MentorTopicRequest[];
  capstoneSchedules: CapstoneSchedule[];
  topic: Topic;
  mentorFeedback: MentorFeedback | null;
  defenseStage?: number
}
