import { BaseEntity } from "./_base/base";
import { Idea } from "./idea";
import { Profession } from "./profession";

export interface Specialty extends BaseEntity {
    professionId?: string;
    specialtyName?: string;
    profession?: Profession;
    ideas: Idea[];
}