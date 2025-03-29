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
 
}

export const mentoridearequestService = new MentorIdeaRequestService();
