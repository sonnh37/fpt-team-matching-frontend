import {BaseService} from "@/services/_base/base-service";
import {Const} from "@/lib/constants/const";
import {TopicVersionRequest} from "@/types/topic-version-request";
import axiosInstance from "@/lib/interceptors/axios-instance";
import {BusinessResult} from "@/types/models/responses/business-result";
import {TopicVersionRequestStatus} from "@/types/enums/topic-version-request";

class TopicVersionRequestService extends BaseService<TopicVersionRequest> {
    constructor() {
        super(Const.TOPIC_VERSIONS_REQUEST);
    }

    public async responseByManagerOrMentor({id, status, feedback}: {id: string, status: TopicVersionRequestStatus, feedback: string}) : Promise<BusinessResult<void>> {
        const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/respond-by-mentor-or-manager`, {
            id: id,
            status,
            feedback,
        })

        return response.data
    }

    public async getByRole (role: string) : Promise<BusinessResult<TopicVersionRequest[]>> {
        const response = await axiosInstance.get<BusinessResult<TopicVersionRequest[]>>(`${this.endpoint}/get-by-role?role=${role}`)
        return response.data
    }
}

export const topicVersionRequestService = new TopicVersionRequestService();