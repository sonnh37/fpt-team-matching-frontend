import { IdeaStatus } from "@/types/enums/idea";
import { UpdateCommand } from "../_base/base-command";

export interface IdeaUpdateStatusCommand extends UpdateCommand{
    status?: IdeaStatus;
}