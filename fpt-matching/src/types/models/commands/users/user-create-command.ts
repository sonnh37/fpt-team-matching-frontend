import { Department, Gender } from "@/types/enums/user";
import { CreateCommand } from "../_base/base-command";

export interface UserCreateCommand extends CreateCommand {
  gender?: Gender | null;
  cache?: string | null | undefined;
  username?: string | null | undefined;
  password?: string | null | undefined;
  avatar?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
  email?: string | null | undefined;
  dob?: string | null | undefined;
  phone?: string | null | undefined;
  address?: string | null | undefined;
  department?: Department | null | undefined;
  file?: File | null;
}
