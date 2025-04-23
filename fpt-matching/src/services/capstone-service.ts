import { Const } from "@/lib/constants/const";
import {BaseService} from "@/services/_base/base-service";
import {CapstoneSchedule} from "@/types/capstone-schedule";
import axiosInstance from "@/lib/interceptors/axios-instance";
import {BusinessResult} from "@/types/models/responses/business-result";

class CapstoneScheduleService extends BaseService<CapstoneSchedule>{
    constructor() {
        super(Const.CAPSTONE_SCHEDULES);
    }
    public async getBySemesterAndStage({semesterId, stage}: {semesterId: string, stage: number}) : Promise<BusinessResult<CapstoneSchedule[]>> {
        const response = await axiosInstance.post(`${this.endpoint}/get-by-semester-id-and-stage`, {
            semesterId,
            stage
        });
        return response.data;
    }

    public async importExcelFile({file, stage}: {file: File, stage: number}): Promise<BusinessResult<void>> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("Stage", stage.toString())
        const res = await axiosInstance.post(`${this.endpoint}/import-excel`, formData)
        return res.data;
    }

    public async getByProjectId({projectId} :{projectId: string}) :Promise<BusinessResult<CapstoneSchedule[]>> {
        const response = await axiosInstance.get<BusinessResult<CapstoneSchedule[]>>(`/${this.endpoint}/get-by-project-id/${projectId}`);
        return response.data;
    }

    public async createCapstoneSchedule({projectId, stage,  time, date, hallName}: {projectId: string, stage: number, time: string, date: string, hallName: string}) : Promise<BusinessResult<void>> {
        const response = await axiosInstance.post(`${this.endpoint}`, {
            projectId,
            time,
            date,
            hallName,
            stage,
        });
        return response.data;
    }
    public async updateCapstoneSchedule({projectId, stage, id, time, date, hallName}: {projectId: string, stage: number, id: string, time: string, date: string, hallName: string}) : Promise<BusinessResult<void>> {
        const response = await axiosInstance.put(`${this.endpoint}`, {
            id,
            projectId,
            time,
            date,
            hallName,
            stage,
        });
        return response.data;
    }
}

export const capstoneService = new CapstoneScheduleService();