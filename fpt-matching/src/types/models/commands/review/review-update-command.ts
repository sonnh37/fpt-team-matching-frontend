import {UpdateCommand} from "@/types/models/commands/_base/base-command";

export interface ReviewUpdateCommand extends UpdateCommand{
    projectId?: string;
    number?: number;
    description?: string;
    fileUpload?: string;
    reviewDate?: Date,
    room?: string,
    slot?: number,
    reviewer1Id?: string;
    reviewer2Id?: string;
}