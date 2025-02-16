import { Const } from "@/lib/constants/const";
import { Profession } from "@/types/profession";
import { BaseService } from "./_base/base-service";

class ProfessionService extends BaseService<Profession> {
  constructor() {
    super(Const.PROFESSION);
  }
 
}

export const professionService = new ProfessionService();
