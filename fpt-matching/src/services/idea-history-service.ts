import {BaseService} from "@/services/_base/base-service";
import {IdeaHistory} from "@/types/idea-history";
import {Const} from "@/lib/constants/const";
import {BusinessResult} from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import path from "node:path";
import fs from "fs/promises"
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

    public async getAllIdeaHistoryByIdeaId(ideaId: string) : Promise<BusinessResult<IdeaHistory[]>> {
        const response = await axiosInstance.get<BusinessResult<IdeaHistory[]>>(`${this.endpoint}/idea/${ideaId}`);
        return response.data
    }

    public async fetchFileUpload(file: File): Promise<void> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post('https://localhost:3000/api/upload', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    }
}

export const ideaHistoryService = new IdeaHistoryService();