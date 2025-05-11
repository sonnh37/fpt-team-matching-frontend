import { BaseEntity } from "./_base/base";
import { NotificationType } from "./enums/notification";
import { NotificationXUser } from "./notification-x-user";
import { User } from "./user";

export interface Notification extends BaseEntity {
  userId?: string;
  description?: string;
  type?: NotificationType;
  isRead: boolean;
  user?: User;
  notificationXUsers: NotificationXUser[];
}
