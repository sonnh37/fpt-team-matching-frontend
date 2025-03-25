import { CreateCommand } from "../_base/base-command";

export interface BlogCvCommand extends CreateCommand
 {
    blogId: string ,
    userId: string,
    fileCv?: string

}