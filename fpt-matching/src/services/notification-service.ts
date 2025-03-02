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
    super(Const.NOTIFICATION);
  }

  public fetchPaginatedByCurrentUser = (
    query?: NotificationGetAllByCurrentUserQuery
  ): Promise<BusinessResult<PaginatedResult<Notification>>> => {
    const queryString = qs.stringify(query, { skipNulls: true });
    // queryString = cleanQueryParams(query!);
    return axiosInstance
      .get<BusinessResult<PaginatedResult<Notification>>>(
        `${this.endpoint}/me?isPagination=true&${queryString}`
      )
      .then((response) => {
        return response.data; // Đảm bảo rằng nó trả về dữ liệu
      })
      .catch((error) => {
        return this.handleError(error); // Xử lý lỗi
      });
  };
}

export const notificationService = new NotificationService();
