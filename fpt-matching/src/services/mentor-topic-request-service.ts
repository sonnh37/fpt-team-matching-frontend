import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import {
  BusinessResult,
  BusinessResultBool,
} from "@/types/models/responses/business-result";
import { cleanQueryParams } from "@/lib/utils";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { BusinessResultWithoutData } from "@/types/models/responses/business-result-without-data";
import { MentorTopicRequest } from "@/types/mentor-topic-request";
import { MentorTopicRequestGetAllQuery } from "@/types/models/queries/mentor-topic-requests/mentor-topic-request-get-all-query";
import { MentorTopicRequestUpdateCommand } from "@/types/models/commands/mentor-topic-requests/mentor-topic-request-update-command";
import {CreateCommand} from "@/types/models/commands/_base/base-command";

class MentorTopicRequestService extends BaseService<MentorTopicRequest> {
  constructor() {
    super(Const.MENTOR_TOPIC_REQUESTS);
  }
  public getUserMentorTopicRequests = (
    query?: MentorTopicRequestGetAllQuery
  ): Promise<BusinessResult<QueryResult<MentorTopicRequest>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<QueryResult<MentorTopicRequest>>>(
        `${this.endpoint}/get-user-mentor-topic-requests?isPagination=true&${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public getMentorMentorTopicRequests = (
    query?: MentorTopicRequestGetAllQuery
  ): Promise<BusinessResult<QueryResult<MentorTopicRequest>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<QueryResult<MentorTopicRequest>>>(
        `${this.endpoint}/get-mentor-mentor-topic-requests?isPagination=true&${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public update = (command: MentorTopicRequestUpdateCommand): Promise<BusinessResult<MentorTopicRequest>> => {
      return axiosInstance
        .put<BusinessResult<MentorTopicRequest>>(`${this.endpoint}/status`, command)
        .then((response) => response.data)
        .catch((error) => this.handleError(error));
    };

  public sendRequestTopicByStudent = (command: CreateCommand): Promise<BusinessResult<null>> => {
    return axiosInstance
        .post<BusinessResult<null>>(`${this.endpoint}/student-request-topic`, command)
        .then((response) => response.data)
        .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
 
}

export const mentortopicrequestService = new MentorTopicRequestService();
