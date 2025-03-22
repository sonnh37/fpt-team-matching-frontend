import { BaseEntity } from "./_base/base";
import { Blog } from "./blog";
import { User } from "./user";

export interface Like extends BaseEntity {
    blogId?: string;
    userId?: string;
   
}
