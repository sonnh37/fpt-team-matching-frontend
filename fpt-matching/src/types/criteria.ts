import { BaseEntity } from "./_base/base";
import { AnswerCriteria } from "./answer-criteria";
import { CriteriaXCriteriaForm } from "./criteria-x-criteriaform";

export interface Criteria extends BaseEntity {
  name?: string;
  description?: string;
  valueType?: string;
  criteriaXCriteriaForms: CriteriaXCriteriaForm[];
  answerCriterias: AnswerCriteria[];
}
