import {BaseService} from "@/services/_base/base-service";
import {IdeaHistory} from "@/types/idea-history";
import {Const} from "@/lib/constants/const";
import {BusinessResult} from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import {IdeaHistoryStatus} from "@/types/enums/idea-history";
class IdeaHistoryService extends BaseService<IdeaHistory> {
    constructor() {
        super(Const.IDEA_HISTORIES);
    }

    public async studentUpdateIdea ({ideaId, fileUpdate, reviewStage, note} : {ideaId: string, fileUpdate: string, reviewStage: number, note: string | null}) : Promise<BusinessResult<void>> {
        const response = await axiosInstance.post(`${this.endpoint}/student-update-idea`, {
            ideaId,
            fileUpdate,
            reviewStage,
            note
        })
        return response.data;
    }

    public async getAllIdeaHistoryByIdeaId(ideaId: string) : Promise<BusinessResult<IdeaHistory[]>> {
        const response = await axiosInstance.get<BusinessResult<IdeaHistory[]>>(`${this.endpoint}/idea/${ideaId}`);
        return response.data
    }

    public async lectureUpdate({ideaHistoryId, status, comment}:{ideaHistoryId: string, status: IdeaHistoryStatus, comment: string}) {
        const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/lecturer-update`, {
            id: ideaHistoryId,
            status,
            comment,
        });
        return response.data;
    }
}

export const ideaHistoryService = new IdeaHistoryService();