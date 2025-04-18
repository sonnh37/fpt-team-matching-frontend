import { BaseEntity } from "./_base/base";
import { MentorTopicRequestStatus } from "./enums/mentor-idea-request";
import { Idea } from "./idea";
import { Project } from "./project";

export interface MentorTopicRequest extends BaseEntity {
  projectId?: string;
  ideaId?: string;
  status?: MentorTopicRequestStatus | null;
  project?: Project | null;
  idea?: Idea | null;
}
