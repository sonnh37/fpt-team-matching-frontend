import { Project } from "@/types/project";
import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { TeamCreateCommand } from "@/types/models/commands/projects/team-create-command";
import { ProjectGetListForMentorQuery } from "@/types/models/queries/projects/project-get-list-for-mentor-query";
import { cleanQueryParams } from "@/lib/utils";
import { ProjectSearchQuery } from "@/types/models/queries/projects/project-search-query";

class ProjectSerivce extends BaseService<Project> {
  constructor() {
    super(Const.PROJECTS);
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

  public getProjectInSemesterCurrentInfo = async (): Promise<
    BusinessResult<Project>
  > => {
    try {
      const response = await axiosInstance.get<BusinessResult<Project>>(
        `${this.endpoint}/semester-current/get-by-user-id`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };

  public searchProjects = async (
    query?: ProjectSearchQuery
  ): Promise<BusinessResult<QueryResult<Project>>> => {
    try {
      const cleanedQuery = cleanQueryParams(query);
      const response = await axiosInstance.get<
        BusinessResult<QueryResult<Project>>
      >(`${this.endpoint}/search?${cleanedQuery}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public getAllForMentor = (
    query?: ProjectGetListForMentorQuery
  ): Promise<BusinessResult<QueryResult<Project>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<Project>>>(
        `${this.endpoint}/me/mentor-projects?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
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

  public getAvailableTeamDefense = async (stage: number): Promise<File> => {
    try {
      const response = await axiosInstance.get<Blob>(
        `${this.endpoint}/export-excel/${stage}`,
        { responseType: "blob" }
      );

      const blob = response.data;
      const fileName = "DanhSachRaHoiDong.xlsx";
      const file = new File([blob!], fileName, { type: blob!.type || ".xlsx" });
      return file;
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

  public async updateDefenseStage({
    projectId,
    defenseStage,
  }: {
    projectId: string;
    defenseStage: number;
  }) {
    const response = await axiosInstance.put<BusinessResult<void>>(
      `${this.endpoint}/update-defense-stage`,
      {
        id: projectId,
        defenseStage: defenseStage,
      }
    );
    return response.data;
  }

  public async getProjectBySemesterAndStage({
    semester,
    stage,
  }: {
    semester: string;
    stage: number;
  }): Promise<BusinessResult<Project[]>> {
    const response = await axiosInstance.get<BusinessResult<Project[]>>(
      `${this.endpoint}/get-by-semester-and-stage?semester=${semester}&stage=${stage}`
    );
    return response.data;
  }

  public async getProjectNotCanceled() : Promise<BusinessResult<Project[]>> {
    const response = await axiosInstance.get<BusinessResult<Project[]>>(`${this.endpoint}/get-project-not-canceled`);
    return response.data
  }

  public async createProjectByManager({project} : {project: Project}) : Promise<BusinessResult<void>> {
    const response = await axiosInstance.post<BusinessResult<void>>(`${this.endpoint}/create-project-by-manager`, {
      ...project
    });
    return response.data;
  }

  public async cancelProjectByManager({projectId} : {projectId: string}): Promise<BusinessResult<void>> {
    const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/cancel-project-by-manager/${projectId}`);
    return response.data
  }
}


  public submitBlockProjectByStudent = async (
    projectId?: string
  ): Promise<BusinessResult<Project>> => {
    try {

      const response = await axiosInstance.get<BusinessResult<Project> >(`${this.endpoint}/submit-block-project-by-student/?${projectId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };
  public BlockProjectByManager = async (
    projectId?: string
  ): Promise<BusinessResult<Project>> => {
    try {

      const response = await axiosInstance.get<BusinessResult<Project> >(`${this.endpoint}/block-project-by-manager/?${projectId}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };
}


export const projectService = new ProjectSerivce();
