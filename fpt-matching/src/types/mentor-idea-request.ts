import { MentorIdeaRequestStatus } from "./enums/mentor-idea-request";
import { Idea } from "./idea";
import { Project } from "./project";

export interface MentorIdeaRequest {
  projectId?: string;
  ideaId?: string;
  status?: MentorIdeaRequestStatus | null;
  project?: Project | null;
  idea?: Idea | null;
}
