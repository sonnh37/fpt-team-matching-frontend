import { Project } from "@/types/project";
import { Const } from "@/lib/constants/const";
import React from "react";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { TeamCreateCommand } from "@/types/models/commands/projects/team-create-command";

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

  public getProjectInfoCheckLeader = async (): Promise<
    BusinessResult<Project>
  > => {
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
