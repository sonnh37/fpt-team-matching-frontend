import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { User } from "./user";

export interface Comment extends BaseEntity {
    blogId?: string;
    userId?: string;
    content?: string;
    blog?: Blog;
    user?: User;
}