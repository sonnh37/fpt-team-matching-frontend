import { Const } from "@/lib/constants/const";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseService } from "./_base/base-service";

import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { TopicCreateCommand } from "@/types/models/commands/topic/topic-create-command";
import { TopicUpdateStatusCommand } from "@/types/models/commands/topic/topic-update-status-command";
import { TopicGetCurrentByStatusQuery } from "@/types/models/queries/topics/topic-get-current-by-status";
import { TopicGetListByStatusAndRoleQuery } from "@/types/models/queries/topics/topic-get-list-by-status-and-roles-query";
import { TopicGetListForMentorQuery } from "@/types/models/queries/topics/topic-get-list-for-mentor-query";
import { Topic } from "@/types/topic";
import { TopicGetListOfSupervisorsQuery } from "@/types/models/queries/topics/topic-get-list-of-supervisor-query";
import { TopicUpdateCommand } from "@/types/models/commands/topic/topic-update-command";
import {
  TopicLecturerCreatePendingCommand,
  TopicResubmitForMentorByStudentCommand,
  TopicSubmitForMentorByStudentCommand,
} from "@/types/models/commands/topic/topic-student-create-pending-command";
import { TopicUpdateAsProjectCommand } from "@/types/models/commands/topic/topic-update-as-project-command";
import { TopicCreateDraftCommand } from "@/types/models/commands/topic/topic-create-draft-command";
import { TopicUpdateDraftCommand } from "@/types/models/commands/topic/topic-update-draft-command";

class TopicService extends BaseService<Topic> {
  constructor() {
    super(Const.TOPICS);
  }

  public getAllTopicsOfSupervisors = async (
    query?: TopicGetListOfSupervisorsQuery
  ): Promise<BusinessResult<QueryResult<Topic>>> => {
    try {
      const cleanedQuery = cleanQueryParams(query);
      const response = await axiosInstance.get<
        BusinessResult<QueryResult<Topic>>
      >(`${this.endpoint}/supervisors?${cleanedQuery}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public getAllForMentor = (
    query?: TopicGetListForMentorQuery
  ): Promise<BusinessResult<QueryResult<Topic>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<Topic>>>(
        `${this.endpoint}/me/mentor-topics?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };


  public getTopicInvitesForSubMentor = (
    query?: TopicGetListForMentorQuery
  ): Promise<BusinessResult<QueryResult<Topic>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<Topic>>>(
        `${this.endpoint}/me/submentor-topic-invites?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public createTopicByStudent = (
    command: TopicCreateCommand
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .post<BusinessResult<Topic>>(
        `${this.endpoint}/create-pending-by-student`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getTopicsOfReviewerByRolesAndStatus = async (
    query?: TopicGetListByStatusAndRoleQuery
  ): Promise<BusinessResult<QueryResult<Topic>>> => {
    try {
      const cleanedQuery = cleanQueryParams(query);
      const response = await axiosInstance.get<
        BusinessResult<QueryResult<Topic>>
      >(`${this.endpoint}/me/by-status-and-roles?${cleanedQuery}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public createTopicByLecturer = (
    command: TopicCreateCommand
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .post<BusinessResult<Topic>>(
        `${this.endpoint}/create-pending-by-lecturer`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public submitTopicToMentorByStudent = (
    command: TopicSubmitForMentorByStudentCommand
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .post<BusinessResult<Topic>>(
        `${this.endpoint}/submit-to-mentor-by-student`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public submitTopicOfLecturerByLecturer = (
    command: TopicLecturerCreatePendingCommand
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .post<BusinessResult<Topic>>(
        `${this.endpoint}/submit-topic-of-lecturer-by-lecturer`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public submitTopicOfStudentByLecturer = (
    topicId: string
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .put<BusinessResult<Topic>>(
        `${this.endpoint}/submit-topic-of-student-by-lecturer/${topicId}`
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public resubmitTopicToMentorByStudent = (
    command: TopicResubmitForMentorByStudentCommand
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .post<BusinessResult<Topic>>(
        `${this.endpoint}/resubmit-to-mentor-by-student`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getTopicByUser = (): Promise<BusinessResult<Topic[]>> => {
    return axiosInstance
      .get<BusinessResult<Topic[]>>(`${this.endpoint}/get-by-user-id`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error));
  };

  public getCurrentTopicOfMeByStatus = (
    query: TopicGetCurrentByStatusQuery
  ): Promise<BusinessResult<Topic[]>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<Topic[]>>(
        `${this.endpoint}/me/by-list-status?${cleanedQuery}`
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error));
  };

  public updateStatus = (
    command: TopicUpdateStatusCommand
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .put<BusinessResult<Topic>>(`${this.endpoint}/status`, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public updateTopicAsProject = (
    command: TopicUpdateAsProjectCommand
  ): Promise<BusinessResult<Topic>> => {
    return axiosInstance
      .put<BusinessResult<Topic>>(`${this.endpoint}/select-as-project`, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  // public getAllTopicsOfSupervisors = (
  //   query?: TopicGetListOfSupervisorsQuery
  // ): Promise<BusinessResult<QueryResult<Topic>>> => {
  //   const cleanedQuery = cleanQueryParams(query);

  //   return axiosInstance
  //     .get<BusinessResult<QueryResult<Topic>>>(
  //       `${this.endpoint}/supervisors?${cleanedQuery}`
  //     )
  //     .then((response) => {
  //       return response.data;
  //     })
  //     .catch((error) => {
  //       return this.handleError(error);
  //     });
  // };

  public async getApprovedTopicsDoNotHaveTeam(): Promise<
    BusinessResult<Topic[]>
  > {
    const response = await axiosInstance.get<BusinessResult<Topic[]>>(
      `${this.endpoint}/get-approved-topics-do-not-have-team`
    );
    return response.data;
  }

  public createDraft = async (
    command: TopicCreateDraftCommand
  ): Promise<BusinessResult<Topic>> => {
    try {
      const response = await axiosInstance.post<BusinessResult<Topic>>(
        `${this.endpoint}/create-draft`,
        command
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };

  public updateDraft = async (
    command: TopicUpdateDraftCommand
  ): Promise<BusinessResult<Topic>> => {
    try {
      const response = await axiosInstance.put<BusinessResult<Topic>>(
        `${this.endpoint}/update-draft`,
        command
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  };
  
}

export const topicService = new TopicService();
