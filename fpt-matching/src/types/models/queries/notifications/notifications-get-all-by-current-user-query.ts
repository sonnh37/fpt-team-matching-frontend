import { BaseQueryableQuery } from "../_base/base-query";

export interface NotificationGetAllByCurrentUserQuery extends BaseQueryableQuery {
  isRead?: boolean;
}
