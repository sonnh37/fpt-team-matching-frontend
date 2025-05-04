import { IdeaType, IdeaStatus } from "@/types/enums/idea";
import { BaseQueryableQuery } from "../_base/base-query";

export interface TopicGetListOfSupervisorsQuery extends BaseQueryableQuery {
  ideaVersionId?: string;
  topicCode?: string;
  englishName?: string;
}
