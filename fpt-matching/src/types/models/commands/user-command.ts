import { Gender, UserStatus } from "@/types/enums/user";
import { CreateCommand, UpdateCommand } from "./_base/base-command";

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
  department?: string | null | undefined;
  file?: File | null;
}

export interface UserUpdateCommand extends UpdateCommand {
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
  department?: string | null | undefined;
  file?: File | null;
}

export interface UserUpdatePasswordCommand {
  password?: string | null | undefined;
}
