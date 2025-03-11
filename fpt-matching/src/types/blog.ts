import { BaseEntity } from "./_base/base";
import { BlogCv } from "./blog-cv";
import { BlogStatus, BlogType } from "./enums/blog";
import { Like } from "./like";
import { Project } from "./project";
import { User } from "./user";

export interface Blog extends BaseEntity {
    userId?: string;
    projectId?: string;
    title?: string;
    content?: string;
    skillRequired?: string;
    type?: BlogType;
    status?: BlogStatus;
    comments: Comment[];
    blogCvs: BlogCv[];
    likes: Like[];
    user?: User;
    project?: Project;
}