import { Const } from '@/lib/constants/const';
import { Like } from '@/types/like';
import React from 'react'
import { BaseService } from './_base/base-service';

class LikeService extends BaseService<Like> {
    constructor() {
      super(Const.LIKE);
    }
}

export const likeService = new LikeService();
