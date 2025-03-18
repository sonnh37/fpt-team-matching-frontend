import { Const } from '@/lib/constants/const';

import React from 'react'
import { BaseService } from './_base/base-service';
import { Comment } from '@/types/comment';

class CommentService extends BaseService<Comment> {
    constructor() {
      super(Const.COMMENT);
    }
}

export const commentService = new CommentService();
