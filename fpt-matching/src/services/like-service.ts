import { Const } from '@/lib/constants/const';
import { Like } from '@/types/like';
import React from 'react'
import { BaseService } from './_base/base-service';
import { BusinessResult } from '@/types/models/responses/business-result';
import axiosInstance from '@/lib/interceptors/axios-instance';

class LikeService extends BaseService<Like> {
  constructor() {
    super(Const.LIKES);
  }


  public deleteCommentPermant = async (projectId: string): Promise<BusinessResult<Like>> => {
      return await axiosInstance.delete<BusinessResult<Like>>(
        `${this.endpoint}/delete-by-blog-id/${projectId}`
      ).then((response) => response.data)
        .catch((error) => this.handleError(error)); // Xử lý lỗi
  }
}

export const likeService = new LikeService();
