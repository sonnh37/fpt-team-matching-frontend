import { BaseEntity } from "./_base/base";
import { Specialty } from "./specialty";

export interface Profession extends BaseEntity {
    professionName?: string;
    specialties: Specialty[];
}
