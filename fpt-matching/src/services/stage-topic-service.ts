import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { StageTopic } from "@/types/stage-topic";

class StageTopicSerivce extends BaseService<StageTopic> {
  constructor() {
    super(Const.STAGE_TOPICS);
  }

  public getByStageNumber = (
    number: number
  ): Promise<BusinessResult<StageTopic>> => {
    return axiosInstance
      .get<BusinessResult<StageTopic>>(`${this.endpoint}/stage-number/${number}`)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public async getCurrentStageTopic(): Promise<BusinessResult<StageTopic>> {
    try {
      const response = await axiosInstance.get(`${this.endpoint}/current`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async pubicStageTopic({stageTopicId}: { stageTopicId: string }): Promise<BusinessResult<void>> {
    const response = await axiosInstance.get<BusinessResult<void>>(`${this.endpoint}/show-result/${stageTopicId}`);
    return response.data
  }
}

export const stagetopicService = new StageTopicSerivce();
