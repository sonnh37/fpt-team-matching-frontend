import {BaseService} from "@/services/_base/base-service";
import {BusinessResult} from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";
import {Review} from "@/types/review";
import {ReviewExcelModels} from "@/types/review-excel-models";

class ReviewService extends BaseService<Review>{
    constructor() {
        super("reviews");
    }

    public importReviewFromXLSX = async (
        file: File,
        reviewNumber: number,
        semesterId: string,
    ): Promise<BusinessResult<ReviewExcelModels[]>> => {
        try {

            const formData = new FormData();
            formData.append("file", file);
            formData.append("reviewNumber", reviewNumber.toString())
            formData.append("semesterId", semesterId);
            const response = await axiosInstance.post<BusinessResult<ReviewExcelModels[]>>(`${this.endpoint}/import-file-excel-review`, formData, {});
            return response.data;
        } catch (error) {
            this.handleError(error);
            return Promise.reject(error);
        }
    };

    public getReviewBySemesterAndReviewNumber = async (
        {
            semesterId,
            reviewNumber,
        }: {
            semesterId: string,
            reviewNumber: number,
        }
    ): Promise<BusinessResult<[Review]>> => {


        const response = await axiosInstance.post(`${this.endpoint}/get-by-review-number-and-semester-id`, {
            "semesterId": semesterId,
            "number": reviewNumber,
        }, {});
        return response.data;
    }

    public async getReviewDetails (id: string) : Promise<BusinessResult<Review>> {
        const response = await axiosInstance.get(`${this.endpoint}/${id}`);
        return response.data;
    }


    public async uploadFileUrp ({reviewId, fileUrl}: {reviewId: string, fileUrl: string}): Promise<BusinessResult<void>> {
        const response = await axiosInstance.put(`${this.endpoint}/upload-file-url-review`, {
            "reviewId": reviewId,
            "fileUrl": fileUrl,
        })

        return response.data;
    }

    public async getReviewByProjectId ({projectId} : {projectId: string}) : Promise<BusinessResult<Review[]>> {
        const response = await axiosInstance.get(`${this.endpoint}/get-by-projectId/${projectId}`);
        return response.data;
    }

    public async getReviewByReviewerId ({reviewerId} : {reviewerId: string}) : Promise<BusinessResult<Review[]>> {
        const response = await axiosInstance.get(`${this.endpoint}/reviewer?reviewerId=${reviewerId}`);
        return response.data;
    }

    public async updateDemo ({reviewId} :{reviewId: string}) : Promise<BusinessResult<void>> {
        const response = await axiosInstance.put<BusinessResult<void>>(`${this.endpoint}/update-demo?reviewId=${reviewId}`);
        return response.data;
    }
}



export const reviewService = new ReviewService();