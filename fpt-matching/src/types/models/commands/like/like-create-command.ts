import { CreateCommand } from "../_base/base-command";


export interface LikeCreateCommand extends CreateCommand {
    blogId: string,
    userId: string
}