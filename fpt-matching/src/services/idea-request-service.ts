import { Const } from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { IdeaRequest } from "@/types/idea-request";
import { IdeaRequestGetAllByStatusQuery } from "@/types/models/queries/idea-requests/idea-request-gey-all-by-status-query";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseService } from "./_base/base-service";

class IdeaRequestService extends BaseService<IdeaRequest> {
  constructor() {
    super(Const.IDEA_REQUEST);
  }
  public fetchPaginatedByStatus = (
    query?: IdeaRequestGetAllByStatusQuery
  ): Promise<BusinessResult<PaginatedResult<IdeaRequest>>> => {
    const cleanedQuery = cleanQueryParams(query ?? {});

    return axiosInstance
      .get<BusinessResult<PaginatedResult<IdeaRequest>>>(
        `${this.endpoint}/by-status-and-idea-id?${cleanedQuery}&isPagination=true`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };
}

export const ideaRequestService = new IdeaRequestService();
