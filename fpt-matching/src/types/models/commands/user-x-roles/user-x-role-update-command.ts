import { Department, Gender } from "@/types/enums/user";
import { UpdateCommand } from "../_base/base-command";

export interface UserXRoleUpdateCommand extends UpdateCommand {
  userId?: string;
  roleId?: string;
  semesterId?: string;
  isPrimary: boolean;
}
