import { Const } from "@/lib/constants/const";
import { Semester } from "@/types/semester";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";

class SemesterService extends BaseService<Semester> {
  constructor() {
    super(Const.SEMESTER);
  }
 
   public fetchLatest = (): Promise<BusinessResult<Semester>> => {
      return axiosInstance
        .get<BusinessResult<Semester>>(`${this.endpoint}/latest`)
        .then((response) => response.data)
        .catch((error) => this.handleError(error)); // Xử lý lỗi
    };
}

export const semesterService = new SemesterService();
