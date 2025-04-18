import { BaseEntity } from "./_base/base";
import { Criteria } from "./criteria";

export interface CriteriaXCriteriaForm extends BaseEntity {
    criteriaFormId?: string;
    criteriaId?: string;
    criteria: Criteria;
  
}