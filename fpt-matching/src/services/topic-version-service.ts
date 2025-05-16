import {BaseService} from "@/services/_base/base-service";
import {TopicVersion} from "@/types/topic-version";
import {Const} from "@/lib/constants/const";
import axiosInstance from "@/lib/interceptors/axios-instance";
import {BusinessResult} from "@/types/models/responses/business-result";

class TopicVersionService extends BaseService<TopicVersion> {
    constructor() {
        super(Const.TOPIC_VERSIONS);
    }

    public updateByStudent = async ({topicId, fileUpdate, reviewStage, note} : {topicId: string, fileUpdate: string, reviewStage: number, note: string | null}) => {
        const response = await axiosInstance.post<BusinessResult<void>>(`${this.endpoint}/update-topic-by-student`, {
            topicId,
            fileUpdate,
            reviewStage,
            note,
        })
        return response.data;
    }

    public getByTopicId = async (topicId: string): Promise<BusinessResult<TopicVersion[]>> => {
        const response = await axiosInstance.get<BusinessResult<TopicVersion[]>>(`${this.endpoint}/get-by-topic-version-id?id=${topicId}`);
        return response.data
    }
}

export const topicVersionService = new TopicVersionService();