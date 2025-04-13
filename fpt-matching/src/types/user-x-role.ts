import { BaseEntity } from "./_base/base";
import { Role } from "./role";
import { Semester } from "./semester";
import { User } from "./user";

export interface UserXRole extends BaseEntity {
    userId?: string;
    roleId?: string;
    semesterId?: string;
    isPrimary: boolean;
    role?: Role;
    user?: User;
    semester?: Semester;
}