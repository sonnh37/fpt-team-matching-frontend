"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faEarthAmericas, faPaperclip, faPaperPlane, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
    ModalClose,
} from "@/components/ui/animated-modal";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { BlogGetAllQuery } from '@/types/models/queries/blog/blog-get-all-query';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blog-service';
import CommentBlog from '@/components/_common/comment/comment';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { BlogCreateCommand } from '@/types/models/commands/blog/blog-create-command';
import { BlogStatus, BlogType } from '@/types/enums/blog';
import { useConfirm } from '@/components/_common/formdelete/confirm-context';
import { isExists } from 'date-fns';
import { commentService } from '@/services/comment-service';


export default function Blogmanagement() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [formData, setFormData] = useState({
        projectId: "",
        title: "",
        content: "",
        skillRequired: "",
        type: BlogType.Share, // Loại bài viết
        status: BlogStatus.Public // Trạng thái mặc định
    });
    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)

    let query: BlogGetAllQuery = {
        pageNumber: currentPage,
        userId: user?.id,
        isDeleted: false
    };
    // NẾU NGƯỜI DÙNG BẤM FILTER THÌ MỚI HIỆN RA

    // //goi api bang tanstack
    const {
        data: result,
        refetch,
        isLoading
    } = useQuery({
        queryKey: ["getBlogAllById", query],
        queryFn: () => blogService.fetchPaginated(query),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (result?.data) {
            setTotalPages(result?.data?.totalPages || 1);
            // Chỉ reset về trang 1 nếu dữ liệu mới có số trang nhỏ hơn trang hiện tại
            if (result.data.pageNumber && currentPage > result.data.pageNumber) {
                setCurrentPage(1);
            }
        }
    }, [result]);
      //Đây là form delete trả về true false tái sử dụng được
    const confirm = useConfirm()
    async function handleDelete(id: string){
      
        // Gọi confirm để mở dialog
        const confirmed = await confirm({
            title: "Xóa bài viết",
            description: "Bạn có muốn xóa bài viết này không?",
            confirmText: "Có,xóa nó đi",
            cancelText: "Không,cảm ơn",
        })

        if (confirmed) {
            // Người dùng chọn Yes
            const result = await blogService.delete(id)
            if (result?.status === 1) {
                toast.success("🎉 Chúc mừng bạn đã xóa bài viết thành công!");
                refetch();

            } else {
                toast.error("Lỗi khi xóa bài viết");
            }
            // Thực hiện xóa
        } else {
            // Người dùng chọn No
            toast("Người dùng đã hủy!")
        }
        // }
    }

   


    const handleUpdate = async () => {
        try {
            if (!formData.title || !formData.content) {
                toast.error("⚠️ Vui lòng nhập tiêu đề và nội dung!");
                return;
            }

            const blognew: BlogCreateCommand = {
                title: formData.title,
                content: formData.content,
                skillRequired: formData.skillRequired,
                type: formData.type,
                status: formData.status,
            };

            const result = await blogService.create(blognew);

            if (result?.status === 1) {
                toast.success("🎉 Chúc mừng bạn đã tạo blog thành công!");
                refetch(); // Refresh danh sách blog
            } else {
                toast.error("🚨 Có lỗi xảy ra khi tạo blog, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi khi tạo blog:", error);
            toast.error("⚠️ Lỗi hệ thống, vui lòng thử lại sau!");
        }
    };
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen  transition-colors duration-200">
            <div className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-200'>
                <div className="max-w-4xl mx-auto">
                    <button
                        className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                        </svg>
                        <svg className="w-6 h-6 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
                        </svg>
                    </button>

                    <div className="bg-white dark:bg-gray-800  overflow-hidden transition-colors duration-200">
                        <div className="relative h-60">
                            <img src="https://baocantho.com.vn/image/fckeditor/upload/2023/20231113/images/t2.webp" alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute -bottom-12 left-6">
                                <img src={user?.avatar ?? "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"} alt="Profile" className="w-36 h-36 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                            </div>
                        </div>

                        <div className="pt-16 px-6 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.lastName} {user?.firstName}</h1>
                                    <p className="text-purple-600 dark:text-purple-400">Node.js Developer & Frontend Expert</p>
                                </div>
                                <a
                                    href=""
                                    target="_blank"
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                                >
                                    View Portfolio
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>

                            <p className="mt-6 text-gray-600 dark:text-gray-300">
                                Hi, I'm a passionate developer with expertise in Node.js, React, and Tailwind CSS. I love building efficient and scalable web applications.
                            </p>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg text-sm font-medium">Node.js</span>
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg text-sm font-medium">React</span>
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg text-sm font-medium">Tailwind CSS</span>
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg text-sm font-medium">MySQL</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
                                <a
                                    href="mailto:abhirajk@example.com"
                                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {user?.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='blog-center flex  w-full justify-center '>
                {/* Blog */}
                <div>
                    {isLoading ? (
                        <p>Hiện tại bạn đang không có bài nào cả</p>
                    ) : (
                        <>
                            {
                                result?.data?.results?.map((post) => (
                                    // Cho blog detail

                                    <div key={post.id} className='bg-white max-w-3xl mx-3 my-8 p-6 rounded-xl shadow-md  '>
                                        <div>
                                            {/* Post Header with Avatar, Username, and Date */}
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={post.user?.avatar ?? "/user-avatardefault.jpg"} // Replace with your avatar image
                                                    alt="User Avatar"
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className='flex w-full justify-between'>
                                                    <div>
                                                        <p className="text-lg font-semibold text-gray-800">{post.user?.username}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {post?.createdDate
                                                                ? new Date(post.createdDate).toLocaleString("vi-VN", {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })
                                                                : "Không có ngày "}
                                                            <FontAwesomeIcon icon={faEarthAmericas} />
                                                        </p>

                                                    </div>
                                                    <div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger className='text-xl'>...</DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>
                                                                    <div onClick={()=>handleDelete(post?.id ?? "")}>  Xóa blog</div>
                                                                  
                                                                    </DropdownMenuItem>
                                                                <DropdownMenuItem>Edit blog</DropdownMenuItem>
                                                                <DropdownMenuItem>Ghim blog</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Post Title */}
                                            <div className="text-3xl font-semibold text-gray-800 mt-6">
                                                <Modal>
                                                    <ModalTrigger className="font-bold text-black ">
                                                        <span className="  ">
                                                            {post.title}
                                                        </span>
                                                    </ModalTrigger>
                                                    <ModalBody>
                                                        <ModalContent className='w-full max-h-[80vh] overflow-y-auto '>
                                                            {/* Header - Cố định khi cuộn */}
                                                            <div className="header-post w-full h-auto border-gray-500 p-4 border-b-2 bg-white dark:bg-black sticky top-0 z-10">
                                                                <div className="flex justify-center w-full">
                                                                    Bài viết của {post?.user?.username}
                                                                </div>
                                                                <ModalClose className="absolute top-2 right-2">X</ModalClose>
                                                            </div>
                                                            <div className='body-blogdetail'>
                                                                <div className="flex items-center space-x-4 p-2">
                                                                    <img
                                                                        src="/user-avatardefault.jpg" // Replace with your avatar image
                                                                        alt="User Avatar"
                                                                        className="w-12 h-12 rounded-full"
                                                                    />
                                                                    <div className='flex w-full justify-between'>
                                                                        <div>
                                                                            <p className="text-lg font-semibold text-gray-800">{post?.user?.lastName} {post?.user?.firstName}</p>
                                                                            <p className="text-sm text-gray-500">
                                                                                {post?.createdDate
                                                                                    ? new Date(post.createdDate).toLocaleString("vi-VN", {
                                                                                        day: "2-digit",
                                                                                        month: "2-digit",
                                                                                        year: "numeric",
                                                                                        hour: "2-digit",
                                                                                        minute: "2-digit"
                                                                                    })
                                                                                    : "Không có ngày "}  <FontAwesomeIcon icon={faEarthAmericas} /> </p>
                                                                        </div>
                                                                        <div className='setting-blog'>
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger className='text-xl'>...</DropdownMenuTrigger>
                                                                                <DropdownMenuContent>
                                                                                    <DropdownMenuItem>Xóa</DropdownMenuItem>
                                                                                    <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                                                                    <DropdownMenuItem>Ghim bài viết</DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Post Content */}
                                                                <h1 className=" px-2 ">
                                                                    {post?.title}
                                                                </h1>
                                                                <p className="mt-4 text-gray-700 text-xl px-2 ">
                                                                    {post?.content}
                                                                </p>

                                                                {/* Post Stats (Likes, Comments, Upload Count) */}
                                                                <div className="flex py-3 w-full">
                                                                    <div className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                                                                        <span className="flex items-center">
                                                                            {post?.likes.length ?? 0} lượt thích từ người khác
                                                                        </span>
                                                                        <div className='flex'>
                                                                            <span className="flex items-center">
                                                                                <i className="fas fa-comment text-green-500"></i>
                                                                                <span className="ml-2">{post?.comments.length ?? 0} bình luận  </span>
                                                                            </span>
                                                                            <span className="flex items-center">
                                                                                <i className="fas fa-image text-red-500"></i>
                                                                                <span className="ml-2">{post?.blogCvs.length ?? 0} nộp CV </span>
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>



                                                            {/* Post Stats (Likes, Comments, Upload Count) */}
                                                            <div className="flex w-full text-gray-600 border-y-2 p-3">
                                                                <div className="flex w-full text-xl justify-between  items-center space-x-4">
                                                                    <span className="flex items-center">
                                                                        <i className="fas fa-thumbs-up text-blue-500"></i>
                                                                        <span className="ml-2">  <FontAwesomeIcon icon={faThumbsUp} />  Lượt thích </span>
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <i className="fas fa-comment text-green-500"></i>
                                                                        <span className="ml-2"> <FontAwesomeIcon icon={faComment} /> Bình luận</span>
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <i className="fas fa-image text-red-500"></i>
                                                                        <span className="ml-2"> <FontAwesomeIcon icon={faPaperclip} /> Nộp CV</span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Post Comment */}
                                                            <CommentBlog id={post.id ?? ""} />
                                                        </ModalContent>

                                                    </ModalBody>
                                                </Modal>
                                            </div>
                                            <div className="relative w-full py-5 flex items-center">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full h-[2px] bg-gray-300 blur-md"></div>
                                                </div>
                                                <div className="relative w-full h-[2px] bg-gray-500"></div>
                                            </div>
                                            {/* Post Stats (Likes, Comments, Upload Count) */}
                                            <div className="flex justify-between mt-1 text-gray-600">
                                                <div className="flex  items-center space-x-4">
                                                    <span className="flex items-center">
                                                        <i className="fas fa-thumbs-up text-blue-500"></i>
                                                        <span className="ml-2">    {post.likes?.length ?? 0}    Likes <FontAwesomeIcon icon={faThumbsUp} /> </span>
                                                    </span>
                                                    <span className="flex items-center">
                                                        <i className="fas fa-comment text-green-500"></i>
                                                        <span className="ml-2">{post.comments?.length ?? 0} Comments <FontAwesomeIcon icon={faComment} /></span>
                                                    </span>
                                                    <span className="flex items-center">
                                                        <i className="fas fa-image text-red-500"></i>
                                                        <span className="ml-2">{post.blogCvs?.length ?? 0} Uploads <FontAwesomeIcon icon={faPaperclip} /></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))

                            }

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>


            </div>
        </div>
    )
}


