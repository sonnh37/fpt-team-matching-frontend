import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover } from '@/components/ui/popover'
import { faAngleDown, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { commentService } from '@/services/comment-service'
import { CommentGetAllQuery } from '@/types/models/queries/comment/comment-get-all-query'


interface CommentBlogProps {
    id: string;
}

const CommentBlog: React.FC<CommentBlogProps> = ({ id }) => {
    const query: CommentGetAllQuery = {
        projectId: id
    };

    const {
        data: result,
        refetch,
        isLoading
    } = useQuery({
        queryKey: ["getCommentAllByProject", query],
        queryFn: () => commentService.fetchAll(query),
        refetchOnWindowFocus: false,
    });
    return (
        <div className='blog-comment'>
            <div className='filter-comment'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className='border-none hover:bg-none'>Phù hợp nhất <FontAwesomeIcon icon={faAngleDown} /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2 hover:bg-slate-300">
                                <h4 className="font-medium leading-none">Phù hợp nhất</h4>
                                <p className="text-sm text-muted-foreground">
                                    Hiển thị bình luận được tương tác nhiều nhất
                                </p>
                            </div>
                            <div className="space-y-2  hover:bg-slate-300">
                                <h4 className="font-medium leading-none">Mới nhất</h4>
                                <p className="text-sm text-muted-foreground">
                                    Hiển thị tất cả bình luận mới nhất
                                </p>
                            </div>  <div className="space-y-2  hover:bg-slate-300">
                                <h4 className="font-medium leading-none">Cũ nhất</h4>
                                <p className="text-sm text-muted-foreground">
                                    Hiển thị tất cả bình luận cũ nhất
                                </p>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            { result?.data?.length === 0 ? (
                <div className='comment-content w-full px-3 pt-1 flex justify-center '>
                    <p className=' text-xl'>Chưa có bình luận nào</p>
                </div>
            ) : (

                result?.data?.map((comment, index) => (
                    <div className='comment-content w-full px-3 pt-1'>
                        <div key={index} className='account flex p-2'>
                            <div className='img pr-1'>
                                <img
                                    src={comment.user?.avatar ?? "/user-avatardefault.jpg"}  // Replace with your avatar image
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full"
                                />
                            </div>
                            <div className='comment-account '>
                                <div className=' h-auto bg-gray-200 border-3 p-2 rounded-xl max-w-[800px]'>
                                    <div className='account-name font-bold text-sm'>{comment?.user?.lastName}{comment?.user?.firstName}</div>
                                    <div className='comment w-full h-auto text-sm text-gray-500'>
                                        {comment?.content}
                                    </div>
                                </div>
                                <div className='account-time text-xs pl-1'>
                                    {comment?.createdDate
                                        ? new Date(comment.createdDate).toLocaleString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
                                        : "Không có ngày "}   <FontAwesomeIcon icon={faEarthAmericas} />
                                </div>
                            </div>
                            <div className='setting comment pl-2'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='text-xl'>...</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Xóa bình luận</DropdownMenuItem>
                                        <DropdownMenuItem>Báo cáo bình luận</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        </div>

                    </div>

                ))
            )}




        </div>
    )
}

export default CommentBlog
