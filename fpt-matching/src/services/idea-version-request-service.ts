import { Const } from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { IdeaVersionRequest } from "@/types/idea-version-request";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import { IdeaVersionRequestGetAllCurrentByStatusQuery } from "@/types/models/queries/idea-version-requests/idea-version-request-get-all-current-by-status";
import { IdeaVersionRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/idea-version-requests/idea-version-request-get-all-current-by-status-and-roles";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseService } from "./_base/base-service";
import { IdeaVersionRequestUpdateStatusCommand } from "@/types/models/commands/idea-version-requests/idea-version-request-update-status-command";

class IdeaVersionRequestService extends BaseService<IdeaVersionRequest> {
  constructor() {
    super(Const.IDEA_VERSION_REQUESTS);
  }

  public GetIdeaVersionRequestsCurrentByStatusAndRoles = (
    query?: IdeaVersionRequestGetAllCurrentByStatusAndRolesQuery
  ): Promise<BusinessResult<QueryResult<IdeaVersionRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<IdeaVersionRequest>>>(
        `${this.endpoint}/me/by-status-and-roles?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public getAllWithoutReviewer = (
    query?: BaseQueryableQuery
  ): Promise<BusinessResult<QueryResult<IdeaVersionRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<IdeaVersionRequest>>>(
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
      const res_ = await this.getById(id);
      if (res_.status !== 1) throw new Error(res_.message);

      const idea_id = res_.data?.ideaVersion?.ideaId;
      if (!idea_id) throw new Error("Idea ID không tồn tại");

      const { data: res } = await axiosInstance.delete<BusinessResult<null>>(
        `${this.endpoint}?id=${id}&isPermanent=true`
      );

      if (res.status !== 1) throw new Error(res.message);

      const { data: resIdea } = await axiosInstance.delete<
        BusinessResult<null>
      >(`${Const.IDEAS}?id=${idea_id}&isPermanent=true`);

      return resIdea;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public updateStatusWithCriteriaByMentorOrCouncil = (
      command: IdeaVersionRequestUpdateStatusCommand
  ): Promise<BusinessResult<IdeaVersionRequest>> => {
    return axiosInstance
        .put<BusinessResult<IdeaVersionRequest>>(`${this.endpoint}/respond-by-mentor-or-council`, command)
        .then((response) => response.data)
        .catch((error) => this.handleError(error));
  };

  public createCouncilRequestsForIdea = (
    ideaVersionId?: string
  ): Promise<BusinessResult<IdeaVersionRequest>> => {
    return axiosInstance
      .post<BusinessResult<IdeaVersionRequest>>(
        `${this.endpoint}/create-council-requests`,
        {
          ideaVersionId,
        }
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const ideaVersionRequestService = new IdeaVersionRequestService();
