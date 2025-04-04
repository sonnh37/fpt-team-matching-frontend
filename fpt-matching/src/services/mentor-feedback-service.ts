import { Const } from "@/lib/constants/const";
import {BaseService} from "@/services/_base/base-service";
import { MentorFeedback } from "@/types/mentor-feedback";
import {BusinessResult} from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";

class MentorFeedbackService extends  BaseService<MentorFeedback>{
    constructor() {
        super(Const.MENTOR_FEEDBACKS);
    }

    public postFeedback = async (feedback: MentorFeedback): Promise<BusinessResult<void>> => {
        const response = await axiosInstance.post<BusinessResult<void>>(`${this.endpoint}`, feedback);
        return response.data
    }
}

export const mentorFeedbackService = new MentorFeedbackService();