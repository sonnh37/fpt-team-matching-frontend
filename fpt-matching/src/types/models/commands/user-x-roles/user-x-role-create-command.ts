import { Department, Gender } from "@/types/enums/user";
import { CreateCommand } from "../_base/base-command";

export interface UserXRoleCreateCommand extends CreateCommand {
  userId?: string;
  roleId?: string;
  semesterId?: string;
  isPrimary: boolean;
}
