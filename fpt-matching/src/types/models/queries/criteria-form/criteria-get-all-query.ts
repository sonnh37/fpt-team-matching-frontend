import { CriteriaValueType } from "@/types/enums/criteria";
import { BaseQueryableQuery } from "../_base/base-query";

export interface CriteriaFGetAllQuery extends BaseQueryableQuery {
    question?: string,
    valueType?: CriteriaValueType
}