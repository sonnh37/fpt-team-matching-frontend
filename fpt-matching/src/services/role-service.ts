import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";

import axiosInstance from "@/lib/interceptors/axios-instance";
import { UserXRole } from "@/types/user-x-role";
import { Role } from "@/types/role";

class RoleService extends BaseService<Role> {
  constructor() {
    super(Const.ROLES);
  }
}

export const roleService = new RoleService();
