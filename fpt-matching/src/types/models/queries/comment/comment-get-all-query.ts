import { BaseQueryableQuery } from "../_base/base-query";

export interface CommentGetAllQuery extends BaseQueryableQuery {
    userId?: string,
    projectId?: string,
 
}