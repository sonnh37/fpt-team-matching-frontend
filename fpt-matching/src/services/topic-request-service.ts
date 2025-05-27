import { Const } from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseService } from "./_base/base-service";
import { TopicRequest } from "@/types/topic-request";
import { TopicRequestMentorOrManagerResponseCommand } from "@/types/models/commands/topic-requests/topic-request-mentor-or-manager-response-command";
import { TopicRequestForRespondCommand } from "@/types/models/commands/topic-requests/topic-request-for-respond-command";
import { TopicRequestForSubMentorCommand } from "@/types/models/commands/topic-requests/topic-request-for-submentor-command";

class TopicRequestService extends BaseService<TopicRequest> {
  constructor() {
    super(Const.TOPIC_REQUESTS);
  }

  // public GetTopicRequestsCurrentByStatusAndRoles = (
  //   query?: TopicRequestGetAllCurrentByStatusAndRolesQuery
  // ): Promise<BusinessResult<QueryResult<TopicRequest>>> => {
  //   const cleanedQuery = cleanQueryParams(query);

  //   return axiosInstance
  //     .get<BusinessResult<QueryResult<TopicRequest>>>(
  //       `${this.endpoint}/me/by-status-and-roles?${cleanedQuery}`
  //     )
  //     .then((response) => {
  //       return response.data;
  //     })
  //     .catch((error) => {
  //       return this.handleError(error);
  //     });
  // };

  public getAllWithoutReviewer = (
    query?: BaseQueryableQuery
  ): Promise<BusinessResult<QueryResult<TopicRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<TopicRequest>>>(
        `${this.endpoint}/without-reviewer?${cleanedQuery}`
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  };

  public getAllExceptPending = (
    query?: BaseQueryableQuery
  ): Promise<BusinessResult<QueryResult<TopicRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<TopicRequest>>>(
        `${this.endpoint}/by-status-different-pending?${cleanedQuery}`
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

      const topic_id = res_.data?.topicId;
      if (!topic_id) throw new Error("Topic ID không tồn tại");

      const { data: res } = await axiosInstance.delete<BusinessResult<null>>(
        `${this.endpoint}?id=${id}&isPermanent=true`
      );

      if (res.status !== 1) throw new Error(res.message);

      const { data: resTopic } = await axiosInstance.delete<
        BusinessResult<null>
      >(`${Const.TOPICS}?id=${topic_id}&isPermanent=true`);

      return resTopic;
    } catch (error) {
      return this.handleError(error);
    }
  };

  // public updateStatusWithCriteriaByMentorOrCouncil = (
  //   command: TopicRequestUpdateStatusCommand
  // ): Promise<BusinessResult<TopicRequest>> => {
  //   return axiosInstance
  //     .put<BusinessResult<TopicRequest>>(
  //       `${this.endpoint}/respond-by-mentor-or-council`,
  //       command
  //     )
  //     .then((response) => response.data)
  //     .catch((error) => this.handleError(error));
  // };

  // public createCouncilRequestsForTopic = (
  //   topicVersionId?: string
  // ): Promise<BusinessResult<TopicRequest>> => {
  //   return axiosInstance
  //     .post<BusinessResult<TopicRequest>>(
  //       `${this.endpoint}/create-council-requests`,
  //       {
  //         topicVersionId,
  //       }
  //     )
  //     .then((response) => response.data)
  //     .catch((error) => this.handleError(error)); // Xử lý lỗi
  // };

  public responseByManagerOrMentor = (
    command?: TopicRequestMentorOrManagerResponseCommand
  ): Promise<BusinessResult<TopicRequest>> => {
    return axiosInstance
      .put<BusinessResult<TopicRequest>>(
        `${this.endpoint}/respond-by-mentor-or-manager`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public sendRequestToSubMentorByMentor = (
    command?: TopicRequestForSubMentorCommand
  ): Promise<BusinessResult<TopicRequest>> => {
    return axiosInstance
      .post<BusinessResult<TopicRequest>>(
        `${this.endpoint}/send-request-to-submentor-by-mentor`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public subMentorResponseRequestOfMentor = (
    command?: TopicRequestForRespondCommand
  ): Promise<BusinessResult<TopicRequest>> => {
    return axiosInstance
      .put<BusinessResult<TopicRequest>>(
        `${this.endpoint}/submentor-response-request-of-mentor`,
        command
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const topicRequestService = new TopicRequestService();
