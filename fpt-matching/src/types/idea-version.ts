import { BaseEntity } from "./_base/base";
import { Idea } from "./idea";
import { IdeaVersionRequest } from "./idea-version-request";
import { StageIdea } from "./stage-idea";
import { Topic } from "./topic";

export interface IdeaVersion extends BaseEntity {
  ideaId?: string;
  stageIdeaId?: string;
  version?: number;
  vietNamName?: string;
  englishName?: string;
  description?: string;
  abbreviations?: string;
  enterpriseName?: string;
  teamSize?: number;
  file?: string;
  idea?: Idea;
  stageIdea?: StageIdea;
  topic?: Topic;
  ideaVersionRequests: IdeaVersionRequest[];
}