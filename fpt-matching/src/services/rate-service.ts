import { Rate } from "@/types/rate";
import { BaseService } from "./_base/base-service";
import { Const } from "@/lib/constants/const";

class RateService extends BaseService<Rate>{
    constructor() {
        super(Const.RATE);
      }


}
export const rateService = new RateService();
