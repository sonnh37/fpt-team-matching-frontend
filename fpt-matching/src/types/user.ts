import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { BlogCv } from "./blog-cv";
import { Department, Gender } from "./enums/user";
import { Idea } from "./idea";
import { IdeaHistory } from "./idea-history";
import { IdeaHistoryRequest } from "./idea-history-request";
import { IdeaRequest } from "./idea-request";
import { Invitation } from "./invitation";
import { Like } from "./like";
import { ProfileStudent } from "./profile-student";
import { Project } from "./project";
import { Rate } from "./rate";
import { RefreshToken } from "./refresh-token";
import { Review } from "./review";
import { SkillProfile } from "./skill-profile";
import { TeamMember } from "./team-member";
import { UserXRole } from "./user-x-role";

export interface User extends BaseEntity {
  gender?: Gender;
  cache?: string;
  username?: string;
  password?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  phone?: string;
  address?: string;
  code?: string;
  department?: Department;
  blogs: Blog[];
  ideaRequestOfReviewers: IdeaRequest[];
  ideaHistoryRequestOfReviewers: IdeaHistoryRequest[];
  ideaOfOwners: Idea[];
  ideaOfMentors: Idea[];
  ideaOfSubMentors: Idea[];
  ideaHistoryOfCouncils: IdeaHistory[];
  userXRoles: UserXRole[];
  comments: Comment[];
  invitationOfSenders: Invitation[];
  invitationOfReceivers: Invitation[];
  blogCvs: BlogCv[];
  likes: Like[];
  notifications: Notification[];
  profileStudent?: ProfileStudent;
  projects: Project[];
  projectOfLeaders: Project[];
  refreshTokens: RefreshToken[];
  skillProfiles: SkillProfile[];
  teamMembers: TeamMember[];
  review1s: Review[];
  review2s: Review[];
}
