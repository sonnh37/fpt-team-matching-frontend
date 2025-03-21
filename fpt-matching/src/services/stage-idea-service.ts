import { Const } from "@/lib/constants/const";
import React from "react";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { StageIdea } from "@/types/stage-idea";

class StageIdeaSerivce extends BaseService<StageIdea> {
  constructor() {
    super(Const.STAGE_IDEA);
  }

  public fetchByStageNumber = (number: number): Promise<BusinessResult<StageIdea>> => {
    return axiosInstance
      .get<BusinessResult<StageIdea>>(`${this.endpoint}/stage-number/${number}`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public fetchLatest = (): Promise<BusinessResult<StageIdea>> => {
    return axiosInstance
      .get<BusinessResult<StageIdea>>(`${this.endpoint}/latest`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };
}

export const stageideaService = new StageIdeaSerivce();
