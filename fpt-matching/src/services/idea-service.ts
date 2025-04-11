import { Const } from "@/lib/constants/const";
import { Idea } from "@/types/idea";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { IdeaCreateCommand } from "@/types/models/commands/idea/idea-create-command";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { cleanQueryParams } from "@/lib/utils";
import { IdeaUpdateStatusCommand } from "@/types/models/commands/idea/idea-update-status-command";
import { IdeaRequest } from "@/types/idea-request";
import { IdeaGetListOfSupervisorsQuery } from "@/types/models/queries/ideas/idea-get-list-of-supervisor-query";

class IdeaService extends BaseService<Idea> {
  constructor() {
    super(Const.IDEA);
  }
  public createIdeaByStudent = (
    command: IdeaCreateCommand
  ): Promise<BusinessResult<Idea>> => {
    return axiosInstance
      .post<BusinessResult<Idea>>(
        `${this.endpoint}/student-create-pending`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public createIdeaByLecturer = (
    command: IdeaCreateCommand
  ): Promise<BusinessResult<Idea>> => {
    return axiosInstance
      .post<BusinessResult<Idea>>(
        `${this.endpoint}/lecturer-create-pending`,
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
    const cleanedQuery = cleanQueryParams(query ?? {});

    return axiosInstance
      .get<BusinessResult<Idea[]>>(
        `${this.endpoint}/me/by-status?${cleanedQuery}&isPagination=true`
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error));
  };

  public updateStatus = (
    command: IdeaUpdateStatusCommand
  ): Promise<BusinessResult<IdeaRequest>> => {
    return axiosInstance
      .put<BusinessResult<IdeaRequest>>(`${this.endpoint}/status`, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public fetchAllIdeasOfSupervisors = (
    query?: IdeaGetListOfSupervisorsQuery
  ): Promise<BusinessResult<QueryResult<Idea>>> => {
    const cleanedQuery = cleanQueryParams(query ?? {});

    return axiosInstance
      .get<BusinessResult<QueryResult<Idea>>>(
        `${this.endpoint}/supervisors?${cleanedQuery}&isPagination=true`
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
