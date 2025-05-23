import { BaseEntity } from "./_base/base";
import { TopicStatus, TopicType } from "./enums/topic";
import { MentorTopicRequest } from "./mentor-topic-request";
import { Project } from "./project";
import { Semester } from "./semester";
import { Specialty } from "./specialty";
import { StageTopic } from "./stage-topic";
import { TopicRequest } from "./topic-request";
import { TopicVersion } from "./topic-version";
import { User } from "./user";

export interface Topic extends BaseEntity {
  ownerId?: string;
  mentorId?: string;
  subMentorId?: string;
  specialtyId?: string;
  stageTopicId?: string;
  topicCode?: string;
  type?: TopicType;
  status?: TopicStatus;
  isExistedTeam: boolean;
  vietNameseName?: string;
  englishName?: string;
  description?: string;
  abbreviation?: string;
  isEnterpriseTopic: boolean;
  enterpriseName?: string;
  semesterId?: string;
  fileUrl?: string;
  project?: Project;
  owner?: User;
  mentor?: User;
  subMentor?: User;
  specialty?: Specialty;
  stageTopic?: StageTopic;
  semester?: Semester;
  topicRequests: TopicRequest[];
  topicVersions: TopicVersion[];
  mentorTopicRequests: MentorTopicRequest[];
  
}
