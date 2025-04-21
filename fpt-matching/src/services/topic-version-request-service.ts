import {BaseService} from "@/services/_base/base-service";
import {Const} from "@/lib/constants/const";
import {TopicVersionRequest} from "@/types/topic-version-request";
import axiosInstance from "@/lib/interceptors/axios-instance";
import {BusinessResult} from "@/types/models/responses/business-result";
import {TopicVersionRequestStatus} from "@/types/enums/topic-version-request";

class TopicVersionRequestService extends BaseService<TopicVersionRequest> {
    constructor() {
        super(Const.TOPIC_VERSIONS);
    }

    public async responseByManagerOrMentor({id, status, feedback}: {id: string, status: TopicVersionRequestStatus, feedback: string}) : Promise<BusinessResult<void>> {
        const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/respond-by-mentor-or-manager`, {
            id: id,
            status,
            feedback,
        })

        return response.data
    }
}

export const topicVersionRequestService = new TopicVersionRequestService();