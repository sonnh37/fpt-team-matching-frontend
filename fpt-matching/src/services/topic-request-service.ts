import { Const } from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { TopicVersionRequest } from "@/types/topic-version-request";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import { TopicVersionRequestGetAllCurrentByStatusQuery } from "@/types/models/queries/topic-version-requests/topic-version-request-get-all-current-by-status";
import { TopicVersionRequestGetAllCurrentByStatusAndRolesQuery } from "@/types/models/queries/topic-version-requests/topic-version-request-get-all-current-by-status-and-roles";
import { BusinessResult } from "@/types/models/responses/business-result";
import { BaseService } from "./_base/base-service";
import { TopicVersionRequestUpdateStatusCommand } from "@/types/models/commands/topic-version-requests/topic-version-request-update-status-command";

class TopicVersionRequestService extends BaseService<TopicVersionRequest> {
  constructor() {
    super(Const.TOPIC_VERSION_REQUESTS);
  }

  public GetTopicVersionRequestsCurrentByStatusAndRoles = (
    query?: TopicVersionRequestGetAllCurrentByStatusAndRolesQuery
  ): Promise<BusinessResult<QueryResult<TopicVersionRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<TopicVersionRequest>>>(
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
  ): Promise<BusinessResult<QueryResult<TopicVersionRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<TopicVersionRequest>>>(
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
  ): Promise<BusinessResult<QueryResult<TopicVersionRequest>>> => {
    const cleanedQuery = cleanQueryParams(query);

    return axiosInstance
      .get<BusinessResult<QueryResult<TopicVersionRequest>>>(
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

      const topic_id = res_.data?.topicVersion?.topicId;
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

  public updateStatusWithCriteriaByMentorOrCouncil = (
      command: TopicVersionRequestUpdateStatusCommand
  ): Promise<BusinessResult<TopicVersionRequest>> => {
    return axiosInstance
        .put<BusinessResult<TopicVersionRequest>>(`${this.endpoint}/respond-by-mentor-or-council`, command)
        .then((response) => response.data)
        .catch((error) => this.handleError(error));
  };

  public createCouncilRequestsForTopic = (
    topicVersionId?: string
  ): Promise<BusinessResult<TopicVersionRequest>> => {
    return axiosInstance
      .post<BusinessResult<TopicVersionRequest>>(
        `${this.endpoint}/create-council-requests`,
        {
          topicVersionId,
        }
      )
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const topicVersionRequestService = new TopicVersionRequestService();
