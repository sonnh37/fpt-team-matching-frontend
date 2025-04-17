import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";

import axiosInstance from "@/lib/interceptors/axios-instance";
import { UserXRole } from "@/types/user-x-role";

class UserXRoleService extends BaseService<UserXRole> {
  constructor() {
    super(Const.USER_X_ROLES);
  }
}

export const userxroleService = new UserXRoleService();
