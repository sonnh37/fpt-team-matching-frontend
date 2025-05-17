import { SemesterStatus } from "@/types/enums/semester";
import { CreateCommand } from "../_base/base-command";

export interface SemesterCreateCommand extends CreateCommand {
  criteriaFormId?: string;
  semesterCode?: string;
  semesterName?: string;
  semesterPrefixName?: string;
  startDate?: Date;
  endDate?: Date;
  onGoingDate?: Date;
  publicTopicDate?: Date;
  status: SemesterStatus;
  maxTeamSize: number;
  minTeamSize: number;
  numberOfTeam: number;
  limitTopicMentorOnly: number;
  limitTopicSubMentor: number;
}
