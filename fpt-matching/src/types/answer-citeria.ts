import { BaseEntity } from "./_base/base";


export interface AnswerCriteria extends BaseEntity {
    ideaRequestId?: string;
    criteriaId?: string;
    value?: string;

}
