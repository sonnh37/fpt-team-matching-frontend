import { Const } from '@/lib/constants/const';
import React from 'react'
import { BaseService } from './_base/base-service';
import { BusinessResult } from '@/types/models/responses/business-result';
import axiosInstance from '@/lib/interceptors/axios-instance';
import { CriteriaForm } from '@/types/criteria-form';

class CriteriaXCriteriaFormService extends BaseService<CriteriaXCriteriaFormService> {
  constructor() {
    super(Const.CRITERIAXFORM);
  }



}

export const criteriaXCriteriaFormService = new CriteriaXCriteriaFormService();
