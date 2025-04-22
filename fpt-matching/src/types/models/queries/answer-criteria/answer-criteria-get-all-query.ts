import { BlogStatus, BlogType } from "@/types/enums/blog";
import { BaseQueryableQuery } from "../_base/base-query";

export interface AnswerCriteriaGetAllQuery extends BaseQueryableQuery {
    ideaVersionRequestId?: string;
    criteriaId?: string;
    value?:string;
}