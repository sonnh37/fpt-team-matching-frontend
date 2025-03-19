import { faAngleDown, faEarthAmericas, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useQuery } from '@tanstack/react-query'
import { commentService } from '@/services/comment-service'
import { CommentGetAllQuery } from '@/types/models/queries/comment/comment-get-all-query'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { CommentCreateCommand } from '@/types/models/commands/comment/comment-create-command'
import { toast } from 'sonner'
import { ModalFooter } from '@/components/ui/animated-modal'


interface CommentBlogProps {
    id: string;
}

const CommentBlog: React.FC<CommentBlogProps> = ({ id }) => {
    const [commentUser, setComment] = useState("");
    const user = useSelector((state: RootState) => state.user.user)

    const [postId, setPostId] = useState(id);

    console.log(id, "test day ne")

    const query: CommentGetAllQuery = {
        blogId: postId
    };
    console.log(query, "test day ")
    const {
        data: result,
        refetch,
        isLoading
    } = useQuery({
        queryKey: ["getCommentAllByProject", query],
        queryFn: () => commentService.fetchAll(query),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (postId) {
            refetch();
        }
    }, [postId, refetch]);



    async function handleComment(comment: string) {
        const query: CommentCreateCommand = {
            userId: user?.id,
            content: comment,
            blogId: postId
        };

        const result = await commentService.create(query);
        if (result.status === 1) {

            toast("Bạn đã mới comment thành công")
            refetch()
        }
    }
    return (
        <div className='blog-comment '>
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

            {result?.data?.length === 0 ? (
                <div className='comment-content w-full px-3 pt-1 my-5 flex justify-center '>
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


            <ModalFooter className="absolute bottom-0 left-0 w-full bg-white mt-2 p-3 border-t">
                <div className='flex w-full'>
                    <img
                        src={user?.avatar ?? "/user-avatardefault.jpg"} // Replace with your avatar image
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="relative w-full">
                        <textarea
                            className="w-full px-2 py-2 pr-10 border rounded-md resize-none"
                            placeholder="Hãy làm người văn minh đi"
                            value={commentUser}
                            onChange={(e) => setComment(e.target.value)} // Cập nhật giá trị state
                        ></textarea>

                        {/* Nút Send nằm góc phải dưới */}
                        <button onClick={() => {
                            if (commentUser.trim() !== "") {
                                handleComment(commentUser); // Gửi nội dung comment + id của project
                                setComment(""); // Xóa nội dung textarea sau khi gửi

                            }
                        }} className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600">
                            <FontAwesomeIcon icon={faPaperPlane} /> Send
                        </button>
                    </div>
                </div>
            </ModalFooter>


        </div>
    )
}

export default CommentBlog
