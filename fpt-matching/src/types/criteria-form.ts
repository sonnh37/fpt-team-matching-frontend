import { BaseEntity } from "./_base/base";
import { CriteriaXCriteriaForm } from "./criteria-x-criteriaform";
import { IdeaVersionRequest } from "./idea-version-request";
import { Semester } from "./semester";

export interface CriteriaForm extends BaseEntity {
  title?: string;
  criteriaXCriteriaForms: CriteriaXCriteriaForm[];
  ideaRequests: IdeaVersionRequest[];
  semesters: Semester[];
}
