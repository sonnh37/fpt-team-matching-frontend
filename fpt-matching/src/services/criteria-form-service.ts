import { Const } from '@/lib/constants/const';
import React from 'react'
import { BaseService } from './_base/base-service';
import { BusinessResult } from '@/types/models/responses/business-result';
import axiosInstance from '@/lib/interceptors/axios-instance';
import { CriteriaForm } from '@/types/criteria-form';

class CriteriaFormService extends BaseService<CriteriaForm> {
  constructor() {
    super(Const.CRITERIAFORM);
  }



}

export const criteriaFormService = new CriteriaFormService();
