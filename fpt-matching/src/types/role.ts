import { BaseEntity } from "./_base/base";
import { UserXRole } from "./user-x-role";

export interface Role extends BaseEntity {
    roleName?: string;
    userXRoles: UserXRole[];
}