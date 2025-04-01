import { Project } from "@/types/project";
import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { TeamCreateCommand } from "@/types/models/commands/projects/team-create-command";
import { ProjectGetListForMentorQuery } from "@/types/models/queries/projects/project-get-list-for-mentor-query";
import { cleanQueryParams } from "@/lib/utils";

class ProjectSerivce extends BaseService<Project> {
  constructor() {
    super(Const.PROJECT);
  }
  public getProjectInfo = async (): Promise<BusinessResult<Project>> => {
    try {
      const response = await axiosInstance.get<BusinessResult<Project>>(
        `${this.endpoint}/get-by-user-id`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };

  public fetchPaginatedForMentor = (
      query?: ProjectGetListForMentorQuery
    ): Promise<BusinessResult<PaginatedResult<Project>>> => {
      const cleanedQuery = cleanQueryParams(query ?? {});
  
      return axiosInstance
        .get<BusinessResult<PaginatedResult<Project>>>(
          `${this.endpoint}/me/mentor-projects?${cleanedQuery}&isPagination=true`
        )
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return this.handleError(error);
        });
    };

  public getProjectInfoCheckLeader = async (): Promise<BusinessResult<Project>> => {
    try {
      const response = await axiosInstance.get<BusinessResult<Project>>(
        `${this.endpoint}/get-of-user-login`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };

  public getAvailableTeamDefense = async (stage: number): Promise<File> => {
      try {
        const response = await axiosInstance.get<Blob>(
            `${this.endpoint}/export-excel/${stage}`, {responseType: "blob"}
        );

        const blob = response.data
        const fileName = "DanhSachRaHoiDong.xlsx"
        const file = new File([blob!], fileName, {type: blob!.type || ".xlsx"} )
        return file;
      }
      catch (error) {
        this.handleError(error);
        return Promise.reject(error);
      }
  }

  public createTeam = (
    command: TeamCreateCommand
  ): Promise<BusinessResult<Project>> => {
    return axiosInstance
      .post<BusinessResult<Project>>(
        `${this.endpoint}/create-project-with-teammember`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error));
  };
}

export const projectService = new ProjectSerivce();
