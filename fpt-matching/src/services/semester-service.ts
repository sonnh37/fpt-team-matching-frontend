import { Const } from "@/lib/constants/const";
import { Semester } from "@/types/semester";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";

import axiosInstance from "@/lib/interceptors/axios-instance";
import {SemesterStatus} from "@/types/enums/semester";

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

  public async getUpComingSemester(): Promise<BusinessResult<Semester>> {
    try {
      const response = await axiosInstance.get<BusinessResult<Semester>>(
        `${this.endpoint}/up-coming`
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

  public async updateStatusToOnGoing() : Promise<BusinessResult<void>> {
    const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/update-status-to-on-going`)
    return response.data
  }

  public async updateStatus({status}: {status: SemesterStatus}) : Promise<BusinessResult<void>> {
    const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/update-status?status=${status}`);
    return response.data
  }
}

export const semesterService = new SemesterService();
