import {BaseService} from "@/services/_base/base-service";
import {IdeaHistory} from "@/types/idea-history";
import {Const} from "@/lib/constants/const";
import {BusinessResult} from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";

class IdeaHistoryService extends BaseService<IdeaHistory> {
    constructor() {
        super(Const.IDEA_HISTORY);
    }

    public async studentUpdateIdea ({ideaId, fileUpdate, reviewStage} : {ideaId: string, fileUpdate: string, reviewStage: number}) : Promise<BusinessResult<void>> {
        const response = await axiosInstance.post(`${this.endpoint}/student-update-idea`, {
            ideaId,
            fileUpdate,
            reviewStage,
        })
        return response.data;
    }
}

export const ideaHistoryService = new IdeaHistoryService();