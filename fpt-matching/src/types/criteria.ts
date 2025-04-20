import { BaseEntity } from "./_base/base";
import { AnswerCriteria } from "./answer-criteria";
import { CriteriaXCriteriaForm } from "./criteria-x-criteriaform";
import {CriteriaValueType } from "./enums/criteria";

export interface Criteria extends BaseEntity {
  question?: string;
  valueType?: CriteriaValueType;
  criteriaXCriteriaForms: CriteriaXCriteriaForm[];
  answerCriterias: AnswerCriteria[];
}
