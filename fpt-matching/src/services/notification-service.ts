import { Const } from "@/lib/constants/const";
import { Notification } from "@/types/notification";
import { BaseService } from "./_base/base-service";
import { BaseQueryableQuery } from "@/types/models/queries/_base/base-query";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { cleanQueryParams } from "@/lib/utils";
import { BusinessResult } from "@/types/models/responses/business-result";
import { NotificationGetAllByCurrentUserQuery } from "@/types/models/queries/notifications/notifications-get-all-by-current-user-query";
import qs from "qs";

class NotificationService extends BaseService<Notification> {
  constructor() {
    super(Const.NOTIFICATIONS);
  }

  public getAllByCurrentUser = (
    query?: NotificationGetAllByCurrentUserQuery
  ): Promise<BusinessResult<QueryResult<Notification>>> => {
    const queryString = qs.stringify(query, { skipNulls: true });
    // queryString = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<QueryResult<Notification>>>(
        `${this.endpoint}/me?isPagination=true&${queryString}`
      )
      .then((response) => {
        return response.data; // Đảm bảo rằng nó trả về dữ liệu
      })
      .catch((error) => {
        return this.handleError(error); // Xử lý lỗi
      });
  };

  public markAsRead = (id: string): Promise<BusinessResult<null>> => {
    return axiosInstance
      .put<BusinessResult<null>>(`${this.endpoint}/${id}/mark-as-read`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public markAllAsRead = (): Promise<BusinessResult<null>> => {
    return axiosInstance
      .put<BusinessResult<null>>(`${this.endpoint}/mark-all-as-read`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public createSystemNotification = async ({description}:{description: string}) : Promise<BusinessResult<void>> => {
    const response =  await axiosInstance
        .post<BusinessResult<void>>(`${this.endpoint}/system`, {
          description
        })
    return response.data;
  }

  public createRoleBasedNotification = async ({description, role}: {description: string, role: string}) : Promise<BusinessResult<void>> => {
    const response = await axiosInstance.post<BusinessResult<void>>(`${this.endpoint}/role-based`, {
      description,
      role
    })
    return response.data
  }

  public createTeamBasedNotification = async ({description, projectId}:{description: string, projectId: string}) : Promise<BusinessResult<void>> => {
    const response = await axiosInstance.post<BusinessResult<void>>(`${this.endpoint}/team-based`, {
      description,
      projectId
    })
    return response.data
  }

  public createIndividualNotification = async ({description, userId} : {description: string, userId: string}) : Promise<BusinessResult<void>> => {
    const response = await axiosInstance.post<BusinessResult<void>>(`${this.endpoint}/individual`, {
      description,
      userId
    })
    return response.data
  }
}

export const notificationService = new NotificationService();
