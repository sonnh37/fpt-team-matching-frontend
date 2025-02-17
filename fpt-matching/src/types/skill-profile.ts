import { BaseEntity } from "./_base/base";
import { ProfileStudent } from "./profile-student";

export interface SkillProfile extends BaseEntity {
    profileStudentId?: string;
    fullSkill?: string;
    json?: string;
    profileStudent?: ProfileStudent;
}