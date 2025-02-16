import { BaseEntity } from "./_base/base";
import { TeamMember } from "./team-member";
import { User } from "./user";

export interface Rate extends BaseEntity {
    teamMemberId?: string;
    rateForId?: string;
    rateById?: string;
    numbOfStar: number;
    rateFor?: User;
    rateBy?: User;
    teamMember?: TeamMember;
}
