import { Gender } from "@/types/enums/user";
import { BaseQueryableQuery } from "../_base/base-query";

export interface UserGetAllQuery extends BaseQueryableQuery {
  gender?: Gender;
  cache?: string;
  username?: string;
  password?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  phone?: string;
  address?: string;
  department?: string;
  role?: string;
}
