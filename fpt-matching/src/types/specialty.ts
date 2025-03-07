import { BaseEntity } from "./_base/base";
import { Idea } from "./idea";
import { Profession } from "./profession";
import { ProfileStudent } from "./profile-student";

export interface Specialty extends BaseEntity {
    professionId?: string;
    specialtyName?: string;
    profession?: Profession;
    ideas: Idea[];
    profileStudents: ProfileStudent[]
}