import { BaseEntity } from "./_base/base";
import { Application } from "./application";
import { BlogType } from "./enums/blog";
import { Like } from "./like";
import { User } from "./user";

export interface Blog extends BaseEntity {
    userId?: string;
    title?: string;
    content?: string;
    type?: BlogType;
    quantity?: number;
    comments: Comment[];
    applications: Application[];
    likes: Like[];
    user?: User;
}