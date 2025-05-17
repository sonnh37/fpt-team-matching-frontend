import {CreateCommand} from "../_base/base-command";

export interface SemesterCreateCommand extends CreateCommand {
    criteriaFormId?: string;
    semesterCode?: string;
    semesterName?: string;
    semesterPrefixName?: string;
    publicTopicDate?: Date | string;
    startDate?: Date | string;
    endDate?: Date | string;
    onGoingDate?: Date | string;
    maxTeamSize?: number;
    minTeamSize?: number;
    numberOfTeam: number;
    limitTopicMentorOnly: number;
    limitTopicSubMentor: number;
}
