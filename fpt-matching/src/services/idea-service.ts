import { Const } from "@/lib/constants/const";
import { Idea } from "@/types/idea";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { IdeaCreateCommand } from "@/types/models/commands/idea/idea-create-command";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { cleanQueryParams } from "@/lib/utils";
import { IdeaUpdateStatusCommand } from "@/types/models/commands/idea/idea-update-status-command";
import { IdeaVersionRequest } from "@/types/idea-version-request";
import { IdeaGetListOfSupervisorsQuery } from "@/types/models/queries/ideas/idea-get-list-of-supervisor-query";
import { IdeaGetListByStatusAndRoleQuery } from "@/types/models/queries/ideas/idea-get-list-by-status-and-roles-query";

class IdeaService extends BaseService<Idea> {
  constructor() {
    super(Const.IDEAS);
  }
  public createIdeaByStudent = (
    command: IdeaCreateCommand
  ): Promise<BusinessResult<Idea>> => {
    return axiosInstance
      .post<BusinessResult<Idea>>(
        `${this.endpoint}/create-pending-by-student`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getIdeasOfReviewerByRolesAndStatus = async (
    query?: IdeaGetListByStatusAndRoleQuery
  ): Promise<BusinessResult<QueryResult<Idea>>> => {
    try {
      const cleanedQuery = cleanQueryParams(query);
      const response = await axiosInstance.get<
        BusinessResult<QueryResult<Idea>>
      >(`${this.endpoint}/me/by-status-and-roles?${cleanedQuery}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public createIdeaByLecturer = (
    command: IdeaCreateCommand
  ): Promise<BusinessResult<Idea>> => {
    return axiosInstance
      .post<BusinessResult<Idea>>(
        `${this.endpoint}/create-pending-by-lecturer`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getIdeaByUser = (): Promise<BusinessResult<Idea[]>> => {
    return axiosInstance
      .get<BusinessResult<Idea[]>>(`${this.endpoint}/get-by-user-id`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error));
  };

  public getCurrentIdeaOfMeByStatus = (
    query: IdeaGetCurrentByStatusQuery
  ): Promise<BusinessResult<Idea[]>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<Idea[]>>(
        `${this.endpoint}/me/by-status?${cleanedQuery}`
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error));
  };

  public updateStatus = (
    command: IdeaUpdateStatusCommand
  ): Promise<BusinessResult<Idea>> => {
    return axiosInstance
      .put<BusinessResult<Idea>>(
        `${this.endpoint}/status`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getAllIdeasOfSupervisors = (
    query?: IdeaGetListOfSupervisorsQuery
  ): Promise<BusinessResult<QueryResult<Idea>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<Idea>>>(
        `${this.endpoint}/supervisors?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };
}

export const ideaService = new IdeaService();
