import { BaseEntity } from "./_base/base";
import { Role } from "./role";
import { User } from "./user";

export interface UserXRole extends BaseEntity {
    userId?: string;
    roleId?: string;
    role?: Role;
    user?: User;
}