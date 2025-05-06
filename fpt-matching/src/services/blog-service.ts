import { Blog } from "@/types/blog";
import { BaseService } from "./_base/base-service";
import { Const } from "@/lib/constants/const";
import { BusinessResult } from "@/types/models/responses/business-result";
import axiosInstance from "@/lib/interceptors/axios-instance";




class BlogService extends BaseService<Blog>{
    constructor() {
        super(Const.BLOGS);
      }
      
      public changStatusBLog = async ( id: string ): Promise<BusinessResult<Blog>> => {
        try {
          const response = await axiosInstance.put<BusinessResult<Blog>>(
            `${this.endpoint}/change-status-blog?id=${id}`
          )
          return response.data;
        } catch (error) {
          return this.handleError(error);
        }
      };
    
      
}


export const blogService = new BlogService();