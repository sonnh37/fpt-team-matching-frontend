import { Const } from "@/lib/constants/const";
import { Idea } from "@/types/idea";
import { BaseService } from "./_base/base-service";

class IdeaService extends BaseService<Idea> {
  constructor() {
    super(Const.IDEA);
  }
 
}

export const ideaService = new IdeaService();
