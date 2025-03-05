import { Const } from "@/lib/constants/const";
import { Idea } from "@/types/idea";
import { BaseService } from "./_base/base-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { IdeaCreateCommand } from "@/types/models/commands/idea/idea-create-command";

class IdeaService extends BaseService<Idea> {
  constructor() {
    super(Const.IDEA);
  }
  public createIdea = (command: IdeaCreateCommand): Promise<BusinessResult<Idea>> => {
    return axiosInstance
      .post<BusinessResult<Idea>>(`${this.endpoint}/student-create-pending`, command)
      .then((response) => response.data)
      .catch((error) => this.handleError(error)); // Xử lý lỗi
  };

  public getIdeaByUser = (): Promise<BusinessResult<Idea[]>> => {
    return axiosInstance
        .get<BusinessResult<Idea[]>>(`${this.endpoint}/get-by-user-id`)
        .then((response) => response.data)
        .catch((error) => this.handleError(error)); // Xử lý lỗi
};
}




export const ideaService = new IdeaService();
