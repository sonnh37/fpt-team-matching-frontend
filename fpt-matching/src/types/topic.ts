import { BaseEntity } from "./_base/base";
import { IdeaVersion } from "./idea-version";
import { MentorTopicRequest } from "./mentor-topic-request";
import { Project } from "./project";
import { TopicVersion } from "./topic-version";

export interface Topic extends BaseEntity {
    ideaVersionId?: string;
    topicCode?: string;
    ideaVersion?: IdeaVersion;
    project?: Project;
    mentorTopicRequests: MentorTopicRequest[];
    topicVersions: TopicVersion[];
}

