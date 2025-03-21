import { BlogStatus, BlogType } from "@/types/enums/blog";
import { BaseQueryableQuery } from "../_base/base-query";

export interface BlogGetAllQuery extends BaseQueryableQuery {
    userId?: string,
    projectId?: string,
    title?: string,
    content?: string,
    skillRequired?: string,
    type?: BlogType,
    status?: BlogStatus,
}