import { CreateCommand, UpdateCommand } from "../_base/base-command";

export interface ProfileStudentUpdateCommand extends UpdateCommand {
  userId?: string | null | undefined;
  specialtyId?: string | null | undefined;
  semesterId?: string | null | undefined;
  bio?: string | null | undefined;
  code?: string | null | undefined;
  achievement?: string | null | undefined;
  experienceProject?: string | null | undefined;
  interest?: string | null | undefined;
  fileCv?: string | null | undefined;

  json?: string | null | undefined;
  fullSkill?: string | null | undefined;
}
