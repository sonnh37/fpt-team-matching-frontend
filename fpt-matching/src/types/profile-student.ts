import { BaseEntity } from "./_base/base";
import { SkillProfile } from "./skill-profile";
import { User } from "./user";

export interface ProfileStudent extends BaseEntity {
    userId?: string;
    bio?: string;
    code?: string;
    isQualifiedForAcademicProject: boolean;
    major?: string;
    achievement?: string;
    semester?: string;
    experienceProject?: string;
    interest?: string;
    fileCv?: string;
    user?: User;
    skillProfiles: SkillProfile[];
}
