import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { User } from "./user";

export interface Application extends BaseEntity {
    userId?: string;
    blogId?: string;
    fileCv?: string;
    blog?: Blog;
    user?: User;
}