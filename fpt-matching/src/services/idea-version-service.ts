import { Const } from "@/lib/constants/const";
import { IdeaVersion } from "@/types/idea-version";
import { BaseService } from "./_base/base-service";
import { IdeaVersionCreateForResubmit } from "@/types/models/commands/idea-versions/idea-version-create-for-resubmit-command";
import axiosInstance from "@/lib/interceptors/axios-instance";
import { BusinessResult } from "@/types/models/responses/business-result";

class IdeaVersionService extends BaseService<IdeaVersion> {
  constructor() {
    super(Const.IDEA_VERSIONS);
  }

  public createVersion = async (command: IdeaVersionCreateForResubmit): Promise<BusinessResult<IdeaVersion>> => {
      try {
        const response = await axiosInstance.post<BusinessResult<IdeaVersion>>(
        `${this.endpoint}/resubmit-by-student-or-mentor`,
          command
        );
        return response.data;
      } catch (error) {
        return this.handleError(error);
      }
    };
}

export const ideaVersionService = new IdeaVersionService();
