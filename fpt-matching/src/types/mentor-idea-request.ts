import { BaseEntity } from "./_base/base";
import { MentorIdeaRequestStatus } from "./enums/mentor-idea-request";
import { Idea } from "./idea";
import { Project } from "./project";

export interface MentorIdeaRequest extends BaseEntity {
  projectId?: string;
  ideaId?: string;
  status?: MentorIdeaRequestStatus | null;
  project?: Project | null;
  idea?: Idea | null;
}
