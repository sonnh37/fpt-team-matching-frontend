import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { User } from "./user";

export interface BlogCv extends BaseEntity {
    userId?: string;
    blogId?: string;
    fileCv?: string;
    blog?: Blog;
    user?: User;
}