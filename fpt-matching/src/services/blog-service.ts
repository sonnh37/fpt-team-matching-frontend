import { Blog } from "@/types/blog";
import { BaseService } from "./_base/base-service";
import { Const } from "@/lib/constants/const";




class BlogService extends BaseService<Blog>{
    constructor() {
        super(Const.BLOGS);
      }

      
}


export const blogService = new BlogService();