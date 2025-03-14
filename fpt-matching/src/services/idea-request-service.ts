import { Const } from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { IdeaRequest } from "@/types/idea-request";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseService } from "./_base/base-service";
import { ideaService } from "./idea-service";
import { Idea } from "@/types/idea";
import { IdeaRequestGetAllByListStatusAndIdeaIdQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-by-list-status-and-idea-id-query";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";

class IdeaRequestService extends BaseService<IdeaRequest> {
  constructor() {
    super(Const.IDEA_REQUEST);
  }
  public fetchPaginatedByListStatusAndIdeaId = (
    query?: IdeaRequestGetAllByListStatusAndIdeaIdQuery
  ): Promise<BusinessResult<PaginatedResult<IdeaRequest>>> => {
    const cleanedQuery = cleanQueryParams(query ?? {});

    return axiosInstance
      .get<BusinessResult<PaginatedResult<IdeaRequest>>>(
        `${this.endpoint}/by-list-status-and-idea-id?${cleanedQuery}&isPagination=true`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public fetchPaginatedWithoutReviewer = (
    query?: BaseQueryableQuery
  ): Promise<BusinessResult<PaginatedResult<IdeaRequest>>> => {
    const cleanedQuery = cleanQueryParams(query ?? {});

    return axiosInstance
      .get<BusinessResult<PaginatedResult<IdeaRequest>>>(
        `${this.endpoint}/without-reviewer?${cleanedQuery}&isPagination=true`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public deletePermanent = async (
    id: string
  ): Promise<BusinessResult<null>> => {
    try {
      const res_ = await this.fetchById(id);
      if (res_.status !== 1) throw new Error(res_.message);

      const idea_id = res_.data?.ideaId;
      if (!idea_id) throw new Error("Idea ID không tồn tại");

      const { data: res } = await axiosInstance.delete<BusinessResult<null>>(
        `${this.endpoint}?id=${id}&isPermanent=true`
      );

      if (res.status !== 1) throw new Error(res.message);

      const { data: resIdea } = await axiosInstance.delete<
        BusinessResult<null>
      >(`${Const.IDEA}?id=${idea_id}&isPermanent=true`);

      return resIdea;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

export const ideaRequestService = new IdeaRequestService();
