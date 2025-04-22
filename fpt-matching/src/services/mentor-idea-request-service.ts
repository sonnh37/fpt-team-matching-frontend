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
import { MentorTopicRequestGetAllQuery } from "@/types/models/queries/mentor-idea-requests/mentor-idea-request-get-all-query";
import { MentorTopicRequestUpdateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-update-command";
import {CreateCommand} from "@/types/models/commands/_base/base-command";

class MentorTopicRequestService extends BaseService<MentorTopicRequest> {
  constructor() {
    super(Const.MENTOR_IDEA_REQUESTS);
  }
  public getUserMentorTopicRequests = (
    query?: MentorTopicRequestGetAllQuery
  ): Promise<BusinessResult<QueryResult<MentorTopicRequest>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<QueryResult<MentorTopicRequest>>>(
        `${this.endpoint}/get-user-mentor-idea-requests?isPagination=true&${cleanedQuery}`
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
        `${this.endpoint}/get-mentor-mentor-idea-requests?isPagination=true&${cleanedQuery}`
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

  public sendRequestIdeaByStudent = (command: CreateCommand): Promise<BusinessResult<null>> => {
    return axiosInstance
        .post<BusinessResult<null>>(`${this.endpoint}/student-request-idea`, command)
        .then((response) => response.data)
        .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
 
}

export const mentortopicrequestService = new MentorTopicRequestService();
