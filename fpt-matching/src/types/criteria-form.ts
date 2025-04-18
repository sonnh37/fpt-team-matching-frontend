import { BaseEntity } from "./_base/base";
import { CriteriaXCriteriaForm } from "./criteria-x-criteriaform";


export interface CriteriaForm extends BaseEntity {
  title?: string;
  criteriaXCriteriaForms: CriteriaXCriteriaForm[];

}
