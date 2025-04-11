import { RootState } from '@/lib/redux/store';
import { likeService } from '@/services/like-service';
import { LikeCreateCommand } from '@/types/models/commands/like/like-create-command';
import { LikeGetAllQuery } from '@/types/models/commands/like/like-get-all-query';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

interface LikeButtonProps {
    postId: string; // ID bài viết
}

const LikeBlog: React.FC<LikeButtonProps> = ({ postId }) =>{
    const user = useSelector((state: RootState) => state.user.user); // lay user :pgom
    const [likes, setLikes] = useState<string[]>([]); // Danh sách user đã like

    // Fetch danh sách like từ API
    const queryall: LikeGetAllQuery = { blogId: postId, isPagination: false, };
    const { data: result, refetch } = useQuery({
        queryKey: ["getLikeAllBlog", postId],
        queryFn: async () => {
            const response = await likeService.fetchAll(queryall);
            return response?.data?.results ?? [];
        },
        refetchOnWindowFocus: false,
    });

    // Cập nhật state khi có dữ liệu mới từ API
    useEffect(() => {
        if (result) {
            setLikes(result.map((like: any) => like.userId)); // Chỉ lấy danh sách userId đã like
        }
    }, [result]);

    // Kiểm tra user đã thích chưa
    const hasLiked = user ? likes.includes(user?.id ?? "") : false;

    const handleLike = async () => {
        if (!user) {
            toast.error("Bạn cần đăng nhập để thích bài viết!");
            return;
        }

        if (hasLiked) {
            //  Nếu đã thích → Unlike (Xóa like)
            const result = await likeService.deleteCommentPermant(postId);
            if (result?.status === 1) {
                setLikes(likes.filter(id => id !== user.id)); // Cập nhật state
                toast.info("Bạn đã bỏ thích bài viết.");
                refetch();
            } else {
                toast.error("Lỗi khi bỏ thích bài viết!");
            }
        } else {
            //  Nếu chưa thích → Thêm like
            const query: LikeCreateCommand = { blogId: postId, userId: user.id ?? "" };
            const result = await likeService.create(query);

            if (result?.status === 1) {
                setLikes([...likes, user.id ?? ""]); // Cập nhật state
                toast.success("Bạn đã thích bài viết! ");
                refetch();
            } else {
                toast.error("Lỗi khi thích bài viết!");
            }
        }
    };

    return (
  
            <button className="flex items-center cursor-pointer" onClick={handleLike}>
                {likes.length ?? 0} Likes
                <FontAwesomeIcon
                    icon={faThumbsUp}
                    className={`ml-2 transition ${hasLiked ? "text-blue-500" : "text-gray-500 hover:text-blue-500"}`}
                />
            </button>
      
    );
};

export default LikeBlog;
