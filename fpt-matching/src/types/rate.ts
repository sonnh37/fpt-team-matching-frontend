import { BaseEntity } from "./_base/base";
import { TeamMember } from "./team-member";
import { User } from "./user";

export interface Rate extends BaseEntity {
    rateForId?: string;
    rateById?: string;
    content?: string;
    numbOfStar: number;
    rateFor?: TeamMember;
    rateBy?: TeamMember;
  }