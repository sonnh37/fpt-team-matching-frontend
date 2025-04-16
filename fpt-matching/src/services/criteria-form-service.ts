import { Const } from '@/lib/constants/const';
import React from 'react'
import { BaseService } from './_base/base-service';
import { BusinessResult } from '@/types/models/responses/business-result';
import axiosInstance from '@/lib/interceptors/axios-instance';
import { CriteriaForm } from '@/types/criteria-form';

class CriteriaService extends BaseService<CriteriaForm> {
  constructor() {
    super(Const.LIKE);
  }



}

export const criteriaService = new CriteriaService();
