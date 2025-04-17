import { Criteria } from "@/types/criteria";
import { BaseService } from "./_base/base-service";
import { Const } from "@/lib/constants/const";

class CriteriaService extends BaseService<Criteria> {
    constructor() {
      super(Const.CRITERIA);
    }
  
  
  
  }
  
  export const criteriaService = new CriteriaService();
  