import { BaseQueryableQuery } from "../../queries/_base/base-query";

export interface LikeGetAllQuery extends BaseQueryableQuery {
    blogId?: string,
    userId?: string
}