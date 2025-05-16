import { BaseEntity } from "./_base/base";
import { Topic } from "./topic";
import { Profession } from "./profession";
import { ProfileStudent } from "./profile-student";

export interface Specialty extends BaseEntity {
  professionId?: string;
  specialtyName?: string;
  profession?: Profession;
  topics: Topic[];
  profileStudents: ProfileStudent[];
}
