import { BlogStatus, BlogType } from "@/types/enums/blog";
import { BaseQueryableQuery } from "../_base/base-query";

export interface BlogCvGetAllQuery extends BaseQueryableQuery {
    userId?: string,
    blogId?: string,
    fileCv?: string,
}