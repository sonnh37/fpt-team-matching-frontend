import { TopicStatus } from "@/types/enums/topic";
import { UpdateCommand } from "../_base/base-command";

export interface TopicUpdateStatusCommand extends UpdateCommand{
    status?: TopicStatus;
}