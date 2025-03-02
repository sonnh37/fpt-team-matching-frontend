import { BaseEntity } from "./_base/base";
import { Semester } from "./semester";
import { SkillProfile } from "./skill-profile";
import { Specialty } from "./specialty";
import { User } from "./user";

export interface ProfileStudent extends BaseEntity {
  userId?: string;
  specialtyId?: string;
  semesterId?: string;
  bio?: string;
  code?: string;
  isQualifiedForAcademicProject: boolean;
  achievement?: string;
  experienceProject?: string;
  interest?: string;
  fileCv?: string;
  specialty?: Specialty;
  user?: User;
  semester?: Semester;
  skillProfiles: SkillProfile[];
}
