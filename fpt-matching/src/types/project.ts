import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { CapstoneSchedule } from "./capstone-schedule";
import { ProjectStatus } from "./enums/project";
import { Idea } from "./idea";
import { Invitation } from "./invitation";
import { MentorFeedback } from "./mentor-feedback";
import { MentorTopicRequest } from "./mentor-topic-request";
import { Review } from "./review";
import { TeamMember } from "./team-member";
import { Topic } from "./topic";
import { User } from "./user";

export interface Project extends BaseEntity {
  leaderId?: string;
  topicId?: string;
  teamCode?: string;
  teamName?: string;
  status?: ProjectStatus;
  teamSize?: number;
  defenseStage?: number;
  leader?: User;
  topic?: Topic;
  mentorFeedback?: MentorFeedback;
  invitations: Invitation[];
  reviews: Review[];
  teamMembers: TeamMember[];
  blogs: Blog[];
  mentorTopicRequests: MentorTopicRequest[];
  capstoneSchedules: CapstoneSchedule[];
  notifications: Notification[];
}