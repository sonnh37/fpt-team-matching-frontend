import { BlogStatus, BlogType } from "@/types/enums/blog";
import { CreateCommand } from "../_base/base-command";

export interface BlogCreateCommand extends CreateCommand {
    title?: string,
    content?: string,
    skillRequired?: string,
    projectId?: string,
    type: BlogType,
    status: BlogStatus

}