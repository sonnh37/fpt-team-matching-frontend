import { Const } from '@/lib/constants/const';
import React from 'react'
import { BaseService } from './_base/base-service';
import { BusinessResult } from '@/types/models/responses/business-result';
import axiosInstance from '@/lib/interceptors/axios-instance';
import { CriteriaForm } from '@/types/criteria-form';
import { AnswerCriteria } from '@/types/answer-citeria';

class AnswerCriteriaService extends BaseService<AnswerCriteria> {
  constructor() {
    super(Const.ANSWERCRITERIA);
  }



}

export const answerCriteriaService = new AnswerCriteriaService();
