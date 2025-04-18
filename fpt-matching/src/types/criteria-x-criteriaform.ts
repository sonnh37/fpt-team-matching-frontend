import { BaseEntity } from "./_base/base";
import { Criteria } from "./criteria";
import { CriteriaForm } from "./criteria-form";

export interface CriteriaXCriteriaForm extends BaseEntity {
  criteriaFormId?: string;
  criteriaId?: string;
  criteriaForm?: CriteriaForm;
  criteria?: Criteria;
}
