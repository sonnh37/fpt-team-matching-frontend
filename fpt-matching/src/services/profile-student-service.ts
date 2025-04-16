import { Const } from "@/lib/constants/const";
import { ProfileStudent } from "@/types/profile-student";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";

class ProfileStudentService extends BaseService<ProfileStudent> {
  constructor() {
    super(Const.PROFILE_STUDENTS);
  }
  public getProfileByCurrentUser = async (): Promise<
    BusinessResult<ProfileStudent>
  > => {
    try {
      const response = await axiosInstance.get<BusinessResult<ProfileStudent>>(
        `${this.endpoint}/user/me`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      return Promise.reject(error);
    }
  };
}

export const profilestudentService = new ProfileStudentService();
