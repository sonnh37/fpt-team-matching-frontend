import { Const } from "@/lib/constants/const";
import { Specialty } from "@/types/specialty";
import { BaseService } from "./_base/base-service";

class SpecialtyService extends BaseService<Specialty> {
  constructor() {
    super(Const.SPECIALTIES);
  }
 
}

export const specialtyService = new SpecialtyService();
