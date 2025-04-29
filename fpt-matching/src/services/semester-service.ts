import { Const } from "@/lib/constants/const";
import { Semester } from "@/types/semester";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";

import axiosInstance from "@/lib/interceptors/axios-instance";

class SemesterService extends BaseService<Semester> {
  constructor() {
    super(Const.SEMESTERS);
  }
  public async getCurrentSemester(): Promise<BusinessResult<Semester>> {
    try {
      const response = await axiosInstance.get<BusinessResult<Semester>>(
        `${this.endpoint}/current`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getBeforeSemester(): Promise<BusinessResult<Semester>> {
    try {
      const response = await axiosInstance.get<BusinessResult<Semester>>(
        `${this.endpoint}/before`
      );
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const semesterService = new SemesterService();
