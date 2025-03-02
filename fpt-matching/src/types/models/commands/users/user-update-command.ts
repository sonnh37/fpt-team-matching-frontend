import { Department, Gender } from "@/types/enums/user";
import { UpdateCommand } from "../_base/base-command";

export interface UserUpdateCommand extends UpdateCommand {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
  password?: string | null;
  avatar?: string | null;
  phone?: string | null;
  dob?: string | null;
  address?: string | null;
  department?: string | null;
  gender?: Gender | null;
  cache?: string | null;
}
