import { Const } from "@/lib/constants/const";
import { BaseService } from "./_base/base-service";
import { BlogCv } from "@/types/blog-cv";

class BlogCvService extends BaseService<BlogCv>{
    constructor() {
        super(Const.BLOGCV);
      }

      
}


export const blogCvService = new BlogCvService();