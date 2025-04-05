import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import {
  BusinessResult,
  BusinessResultBool,
} from "@/types/models/responses/business-result";
import { cleanQueryParams } from "@/lib/utils";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { BusinessResultWithoutData } from "@/types/models/responses/business-result-without-data";
import { MentorIdeaRequest } from "@/types/mentor-idea-request";
import { MentorIdeaRequestGetAllQuery } from "@/types/models/queries/mentor-idea-requests/mentor-idea-request-get-all-query";
import { MentorIdeaRequestUpdateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-update-command";
import {CreateCommand} from "@/types/models/commands/_base/base-command";

class MentorIdeaRequestService extends BaseService<MentorIdeaRequest> {
  constructor() {
    super(Const.MENTOR_IDEA_REQUESTS);
  }
  public getUserMentorIdeaRequests = (
    query?: MentorIdeaRequestGetAllQuery
  ): Promise<BusinessResult<PaginatedResult<MentorIdeaRequest>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<PaginatedResult<MentorIdeaRequest>>>(
        `${this.endpoint}/get-user-mentor-idea-requests?isPagination=true&${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public getMentorMentorIdeaRequests = (
    query?: MentorIdeaRequestGetAllQuery
  ): Promise<BusinessResult<PaginatedResult<MentorIdeaRequest>>> => {
    const cleanedQuery = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<PaginatedResult<MentorIdeaRequest>>>(
        `${this.endpoint}/get-mentor-mentor-idea-requests?isPagination=true&${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public update = (command: MentorIdeaRequestUpdateCommand): Promise<BusinessResult<MentorIdeaRequest>> => {
      return axiosInstance
        .put<BusinessResult<MentorIdeaRequest>>(`${this.endpoint}/status`, command)
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

export const mentoridearequestService = new MentorIdeaRequestService();
