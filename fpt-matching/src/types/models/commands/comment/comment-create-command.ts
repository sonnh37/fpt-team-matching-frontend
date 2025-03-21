import { CreateCommand } from "../_base/base-command";

export interface CommentCreateCommand extends CreateCommand{
    blogId?: string;
    userId?: string;
    content?: string;
    
}