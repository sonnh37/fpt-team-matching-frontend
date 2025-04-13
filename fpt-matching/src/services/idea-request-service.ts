import { Const } from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { IdeaRequest } from "@/types/idea-request";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import { IdeaRequestGetAllCurrentByStatusQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status";
import { IdeaRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/idea-requests/idea-request-get-all-current-by-status-and-roles";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseService } from "./_base/base-service";
import { IdeaRequestUpdateStatusCommand } from "@/types/models/commands/idea-requests/idea-request-update-status-command";

class IdeaRequestService extends BaseService<IdeaRequest> {
  constructor() {
    super(Const.IDEA_REQUEST);
  }

  public GetIdeaRequestsCurrentByStatusAndRoles = (
    query?: IdeaRequestGetAllCurrentByStatusAndRolesQuery
  ): Promise<BusinessResult<QueryResult<IdeaRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<IdeaRequest>>>(
        `${this.endpoint}/me/by-status-and-roles?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public fetchAllWithoutReviewer = (
    query?: BaseQueryableQuery
  ): Promise<BusinessResult<QueryResult<IdeaRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<IdeaRequest>>>(
        `${this.endpoint}/without-reviewer?${cleanedQuery}`
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

  public updateStatus = (
    command: IdeaRequestUpdateStatusCommand
  ): Promise<BusinessResult<IdeaRequest>> => {
    return axiosInstance
      .put<BusinessResult<IdeaRequest>>(`${this.endpoint}/status`, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public updateStatusByLecturer = (
      command: IdeaRequestUpdateStatusCommand
  ): Promise<BusinessResult<IdeaRequest>> => {
    return axiosInstance
        .put<BusinessResult<IdeaRequest>>(`${this.endpoint}/lecturer-response`, command)
        .then((response) => response.data)
        .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public createCouncilRequestsForIdea = (
    ideaId: string
  ): Promise<BusinessResult<IdeaRequest>> => {
    return axiosInstance
      .post<BusinessResult<IdeaRequest>>(
        `${this.endpoint}/create-council-requests`,
        {
          ideaId,
        }
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const ideaRequestService = new IdeaRequestService();
