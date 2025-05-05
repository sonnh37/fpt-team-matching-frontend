import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";

import axiosInstance from "@/lib/interceptors/axios-instance";
import { Topic } from "@/types/topic";
import { cleanQueryParams } from "@/lib/utils";
import { TopicGetListForMentorQuery } from "@/types/models/queries/topics/topic-get-list-for-mentor-query";
import { TopicGetListOfSupervisorsQuery } from "@/types/models/queries/topics/topic-get-list-of-supervisor-query";

class TopicService extends BaseService<Topic> {
  constructor() {
    super(Const.TOPICS);
  }

  public getAllTopicsOfSupervisors = async (
    query?: TopicGetListOfSupervisorsQuery
  ): Promise<BusinessResult<QueryResult<Topic>>> => {
    try {
      const cleanedQuery = cleanQueryParams(query);
      const response = await axiosInstance.get<
        BusinessResult<QueryResult<Topic>>
      >(`${this.endpoint}/supervisors?${cleanedQuery}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public getAllForMentor = (
    query?: TopicGetListForMentorQuery
  ): Promise<BusinessResult<QueryResult<Topic>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<Topic>>>(
        `${this.endpoint}/me/mentor-topics?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };
}

export const topicService = new TopicService();
