import { BaseEntity } from "./_base/base";
import { User } from "./user";

export interface Notification extends BaseEntity {
    userId?: string;
    description?: string;
    type?: string;
    user?: User;
}