import { UpdateCommand } from "../_base/base-command";

export interface TopicUpdateCommand extends UpdateCommand{
    mentorId?: string;
    subMentorId?: string;
    description?: string;
    abbreviations?: string;
    vietNamName?: string;
    englishName?: string;
    file?: string;
}