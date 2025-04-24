import { Const } from "@/lib/constants/const";
import { IdeaVersion } from "@/types/idea-version";
import { BaseService } from "./_base/base-service";

class IdeaVersionService extends BaseService<IdeaVersion> {
  constructor() {
    super(Const.IDEA_VERSIONS);
  }

  public createVersion = async (command: CreateCommand): Promise<BusinessResult<T>> => {
      try {
        const response = await axiosInstance.post<BusinessResult<T>>(
          this.endpoint,
          command
        );
        return response.data;
      } catch (error) {
        return this.handleError(error);
      }
    };
}

export const ideaVersionService = new IdeaVersionService();
