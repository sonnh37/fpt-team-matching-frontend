import {Const} from "@/lib/constants/const";
import {BaseService} from "@/services/_base/base-service";
import {Semester} from "@/types/semester";
import axiosInstance from "@/lib/interceptors/axios-instance";

class HangfireService extends BaseService<Semester> {
    constructor() {
        super(Const.HANGFIRE)
    }

    public async TriggerNow({jobId}: {jobId: string}) {
        const response = await axiosInstance.get<string>(`${this.endpoint}/trigger-now?jobId=${jobId}`);
        return response;
    }
}

export const hangfireService = new HangfireService();
