import { Const } from "@/lib/constants/const";
import { Semester } from "@/types/semester";
import { BaseService } from "./_base/base-service";

class SemesterService extends BaseService<Semester> {
  constructor() {
    super(Const.SEMESTER);
  }
 
}

export const semesterService = new SemesterService();
