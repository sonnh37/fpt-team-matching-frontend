import { BaseEntity } from "./_base/base";
import { User } from "./user";
import {Notification} from "@/types/notification";

export interface NotificationXUser extends BaseEntity {
    userId?: string;
    notificationId?: string;
    isRead: boolean;
    user?: User;
    notification?: Notification;
}
