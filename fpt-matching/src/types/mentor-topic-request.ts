import { BaseEntity } from "./_base/base";
import { Topic } from "./topic";
import { Project } from "./project";
import { MentorTopicRequestStatus } from "./enums/mentor-idea-request";

export interface MentorTopicRequest extends BaseEntity {
  projectId?: string;
  topicId?: string;
  status?: MentorTopicRequestStatus | null;
  project?: Project | null;
  topic?: Topic | null;
}
