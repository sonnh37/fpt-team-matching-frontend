"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faEarthAmericas, faPaperclip, faTrophy, faShare, faCircleUser, faPencil, faNoteSticky, faUser, faVideo, faPhotoFilm, faFaceSmile, faPenNib, faBolt } from "@fortawesome/free-solid-svg-icons";
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
import LikeBlog from '@/components/_common/likeblog/like-blog';
import ProjectInfo from '@/components/_common/projectInfo/project-info';
import UploadCv from '@/components/_common/uploadCv/upload-cv';
import ListUploadCv from '@/components/_common/listupload/list-upload';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';


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

    //làm filter
    const [filterType, setFilterType] = useState<BlogType | null>(null);

    // Hàm thay đổi bộ lọc và gọi API lại
    const handleFilterChange = (type: BlogType) => {
        setFilterType(type);
        refetch();
    };
    const handleNoFilter = () => {
        setFilterType(null);
        // window.location.href = "/social/blog/blogmanagerment"; // Chuyển hướng về trang chủ

    };

    //gọi thông tin user đã đăng nhập
    const user = useSelector((state: RootState) => state.user.user)
    // Lấy tất cả kỹ năng từ skillProfiles, loại bỏ trùng lặp
    // Chuyển Set thành mảng để tránh lỗi
    const uniqueSkills = Array.from(
        new Set(
            user?.profileStudent?.skillProfiles?.flatMap(profile =>
                profile?.fullSkill?.split(",").map(skill => skill.trim())
            ) || []
        )
    );


    let query: BlogGetAllQuery = {
        pageNumber: currentPage,
        userId: user?.id,
        isDeleted: false,
        ...(filterType !== null && { type: filterType }), // Thêm type nếu filterType khác null
    };


    // //goi api blog của user bang tanstack
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
    async function handleDelete(id: string) {

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


    // update blog
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
            <div className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg  overflow-hidden transition-colors duration-200 '>
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
                                <img src={user?.avatar || "/user-avatardefault.jpg"} alt="Profile" className="w-36 h-36 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
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
                                {user?.profileStudent?.bio ?? "Hiện tại người dùng chưa cập nhập bio"}
                            </p>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {uniqueSkills.length > 0 ? (
                                        uniqueSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-600 dark:text-gray-400  "><FontAwesomeIcon icon={faBolt} /> Chưa có kỹ năng nào</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Achievement</h2>
                                <p className="mt-3 text-gray-600 dark:text-gray-300">
                                    <FontAwesomeIcon icon={faTrophy} />  {user?.profileStudent?.achievement ?? "  Người dùng chưa điền thông tin các thành tựu"}

                                </p>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Experience Project</h2>
                                <p className="mt-3 text-gray-600 dark:text-gray-300">
                                    <FontAwesomeIcon icon={faPenNib} />  {user?.profileStudent?.experienceProject ?? "  Người dùng chưa điền thông tin"}

                                </p>
                            </div>


                            <div className="mt-4">
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
            {/* Form tạo blog */}
            <div className='w-full flex items-center justify-center  '>
                <div className='form-create-blog bg-white rounded-xl min-w-[680px] max-w-3xl p-3 mx-2 mt-3 shadow-md'>

                    <div className="flex items-center ">
                        <img
                            src={user?.avatar || "/user-avatardefault.jpg"}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full"
                        />
                        <Modal >
                            <ModalTrigger className='w-full'>
                                <div className="shadow appearance-none bg-slate-200 border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-start ">
                                    {user?.firstName} đi, bạn đang nghĩ gì thế?
                                </div>

                            </ModalTrigger>

                            <ModalBody className='min-h-[60%] max-h-[90%] md:max-w-[40%]'>
                                <ModalContent >
                                    <div className="header-blog mb-4 py-4 border-b-slate-100 h-1/5 bg-orange-400">
                                        <h4 className='text-lg md:text-2xl text-neutral-100 dark:text-neutral-100 font-bold text-center' >
                                            Tạo bài viết của bạn đi
                                        </h4>
                                    </div>
                                    <div className='body-blog w-full h-4/5'>
                                        <div className='headerbody  flex items-center w-full h-1/4 px-3'>
                                            <img
                                                src={user?.avatar || "/user-avatardefault.jpg"}
                                                alt="Avatar"
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className='w-full ml-3 '>
                                                <div className=' '>
                                                    <p className="text-lg font-semibold text-gray-800"><FontAwesomeIcon icon={faUser} /> {user?.lastName} {user?.firstName}</p>
                                                </div>
                                                {/* <div> */}
                                                <select
                                                    name="type"
                                                    className="border p-2 rounded w-48"
                                                // value={postType}
                                                // onChange={handlePostTypeChange}
                                                >
                                                    <option value={BlogType.Share}>Đăng chia sẻ</option>
                                                    <option value={BlogType.Recruit}>Đăng tìm thành viên</option>
                                                </select>
                                                {/* <div>
                              <select
                                name="type"
                                className="border p-2 rounded w-48"
                                value={postType}
                                onChange={handlePostTypeChange}
                              >
                                <option value={BlogType.Share}>Đăng chia sẻ</option>
                                <option value={BlogType.Recruit}>Đăng tìm thành viên</option>
                              </select>
                            </div> */}
                                                {/* </div> */}
                                            </div>
                                        </div>
                                        <div className='body mt-3 h-3/4 px-2'>
                                            <div className='flex'>
                                                <div className='w-1/4 items-center p-2'>
                                                    <h3 > <FontAwesomeIcon icon={faPencil} /> Tiêu đề</h3>
                                                </div>
                                                <input className=' w-3/4' type="text"
                                                    // value={formData.title}
                                                    // name="title"
                                                    // onChange={handleChange}
                                                    placeholder='Nhập tựa đề ở đây' />
                                            </div>
                                            <div className='flex mt-2 h-full'>
                                                <div className='w-1/4 items-center p-2 '>
                                                    <h3 ><FontAwesomeIcon icon={faNoteSticky} /> Nội dung</h3>
                                                </div>
                                                <textarea className='w-3/4 h-40'
                                                    // value={formData.content}
                                                    // name="content"
                                                    // onChange={handleChange}
                                                    placeholder='Viết nội dung ở đây' />
                                            </div>
                                            {/* Nếu chọn "Đăng tìm thành viên" thì hiển thị thêm field nhập
                        {postType === BlogType.Recruit && user?.projects ? ( */}
                                            <div className=''>
                                                <div className='skill'>
                                                    <div className='flex mt-2 h-full'>
                                                        <div className='w-1/4 items-center p-2 '>
                                                            <h3 >Kỹ năng yêu cầu</h3>
                                                        </div>
                                                        <textarea className="w-3/4 border p-2 rounded"
                                                            name="skillRequired"
                                                            placeholder="Nhập kỹ năng yêu cầu"
                                                        //   value={formData.skillRequired}
                                                        //   onChange={handleChange} 
                                                        />
                                                    </div>
                                                </div>
                                                <div className='project py-2'>

                                                    <div className='flex mt-2 h-full mb-4 min-h-28'>
                                                        <div className='w-1/4 items-center p-2  '>
                                                            <h3 >Team của bạn</h3>
                                                        </div>
                                                        <div>
                                                            <h4 className='text-red-400'>*Không bắt buộc</h4>
                                                            {/* <h4 className='text-red-400'>{messageUser}</h4> */}

                                                            {/* <select
                                    name="projectId" className="border p-2 rounded w-48"
                                    value={formData.projectId || ""}  // Đảm bảo không bị undefined
                                    // onChange={handleChange}
                                  >
                                    <option value="">Chọn dự án</option>
                                    {projectUser?.id && (
                                      <option value={projectUser.id}>{projectUser.teamName}</option>
                                    )}
                                  </select> */}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* ) : (
                          <div></div>
                        )} */}
                                        </div>
                                        <div className='flex w-full h-14 absolute bottom-0  items-center justify-center'>
                                            {/* <button onClick={() => handleSubmit()} className='bg-blue-500 h-3/4 w-1/3 mx-2 rounded-xl hover:bg-blue-400 hover:text-black '>Post Bài</button> */}
                                        </div>
                                    </div>
                                </ModalContent>
                            </ModalBody>

                        </Modal>
                    </div>
                    <div className="flex my-3 border-b-2  border-gray-400 px-6"> </div>
                    <div className="flex mt-3 ">

                        <div className="flex space-x-4 justify-center w-full">
                            <button className="text-red-500 hover:text-gray-800 w-1/4">
                                <FontAwesomeIcon icon={faVideo} />
                                <span> </span>
                                Video trực tiếp
                            </button>
                            <button className="text-green-600 hover:text-gray-800 w-1/4">
                                <FontAwesomeIcon icon={faPhotoFilm} />
                                <span> </span>
                                Ảnh/video
                            </button>
                            <button className="text-yellow-600 hover:text-gray-800 w-1/4">
                                <FontAwesomeIcon icon={faFaceSmile} />
                                <span> </span>
                                Cảm xúc/hoạt động
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            {/* form filter */}
            <div className='blog-center flex  w-full justify-center '>
                <div className="mt-3 flex-row bg-white min-w-[680px] max-w-3xl mx-3  p-6 pb-3 rounded-xl shadow-md  ">
                    <div className='flex justify-between'>
                        {/* Tiêu đề */}
                        <h2 className="text-xl font-semibold">Bài viết</h2>

                        {/* Nút chức năng */}
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-gray-100">
                                <span className="text-lg">⚙</span> Bộ lọc
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-gray-100">
                                <span className="text-lg">⚙</span> Quản lý bài viết
                            </button>


                        </div>
                    </div>

                    <div className='border-b-2 w-full my-2 border-black'></div>

                    {/* Chế độ xem */}
                    <div className="flex border-b w-full mt-2">
                        {/* Chế độ xem tất cả */}
                        <button
                            className={`flex-1 py-2 text-sm font-medium border-b-2 ${filterType === null ? "text-blue-600 border-blue-600" : "text-gray-500 hover:text-black border-transparent"
                                }`}
                            onClick={handleNoFilter}
                        >
                            ☰ Chế độ xem tất cả
                        </button>

                        {/* Chế độ xem share */}
                        <button
                            className={`flex-1 py-2 text-sm font-medium border-b-2 ${filterType === BlogType.Share ? "text-blue-600 border-blue-600" : "text-gray-500 hover:text-black border-transparent"
                                }`}
                            onClick={() => handleFilterChange(BlogType.Share)}
                        >
                            <FontAwesomeIcon icon={faShare} className="mr-1" />
                            Chế độ xem share
                        </button>

                        {/* Chế độ xem tìm thành viên */}
                        <button
                            className={`flex-1 py-2 text-sm font-medium border-b-2 ${filterType === BlogType.Recruit ? "text-blue-600 border-blue-600" : "text-gray-500 hover:text-black border-transparent"
                                }`}
                            onClick={() => handleFilterChange(BlogType.Recruit)}
                        >
                            <FontAwesomeIcon icon={faCircleUser} className="mr-1" />
                            Chế độ xem tìm thành viên
                        </button>
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

                                    <div key={post.id} className='bg-white min-w-[680px] max-w-3xl mx-3 my-8 p-6 pb-3 rounded-xl shadow-md   '>
                                        <div>
                                            {/* Post Header with Avatar, Username, and Date */}
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={post.user?.avatar || "/user-avatardefault.jpg"} // Replace with your avatar image
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
                                                                <DropdownMenuItem>Ghim blog</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDelete(post.id ?? "")}>Xóa blog</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* Post Title */}
                                            <div className="text-xl md:text-2xl font-bold text-gray-900 leading-tight pt-3 mt-2">
                                                <Modal>
                                                    <ModalTrigger className=" ">
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
                                                                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                                                                    <DropdownMenuSeparator />
                                                                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                                                                    <DropdownMenuItem>Billing</DropdownMenuItem>
                                                                                    <DropdownMenuItem>Team</DropdownMenuItem>
                                                                                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Post Content */}
                                                                <h1 className="flex text-xl md:text-2xl font-bold text-gray-900 leading-tight px-4 ">
                                                                    {post?.type === BlogType.Recruit && (<div>🔥🔎</div>)} {post?.title}
                                                                </h1>
                                                                <p className="mt-2 font-normal text-base md:text-lg text-gray-700 px-4 ">
                                                                    {post?.content}
                                                                </p>

                                                                {post?.type === BlogType.Recruit && (

                                                                    <div>  <h4 className='text-lg px-4 mt-1'>Kỹ năng yêu cầu :</h4>
                                                                        <div className="mt-1 text-gray-700 font-medium text-base px-4 ">
                                                                            {post?.skillRequired ?? "Hiện tại chưa có."}
                                                                            {/* <getByProjectId id={post?.id}/> */}
                                                                            <h4 className='text-lg mt-1 font-bold  text-gray-900'>Thông tin của team :</h4>
                                                                            <ProjectInfo id={post.projectId ?? ""} />
                                                                        </div>
                                                                    </div>


                                                                )}

                                                                {/* Post Stats (Likes, Comments, Upload Count) */}
                                                                <div className="flex py-3 w-full">
                                                                    <div className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                                                                        <span className="flex items-center ml-3">
                                                                            <LikeBlog postId={post?.id ?? ""} />
                                                                        </span>
                                                                        <div className='flex'>
                                                                            <span className="flex items-center">
                                                                                <i className="fas fa-comment text-green-500"></i>
                                                                                <span className="ml-2">{post?.comments.length ?? 0} bình luận  </span>
                                                                            </span>
                                                                            <span className="flex items-center mr-3">
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
                                            <div className="relative w-full py-3 flex items-center">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full h-[2px] bg-gray-300 blur-md"></div>
                                                </div>
                                                <div className="relative w-full h-[2px] bg-gray-500"></div>
                                            </div>
                                            {/* Post Stats (Likes, Comments, Upload Count) */}
                                            <div className="flex  text-gray-600">
                                                <div className="flex justify-between items-center  w-full space-x-4">
                                                    <span className="flex items-center ml-4 pl-4 p-2 hover:bg-slate-200">
                                                        <span className="ml-2 text-lg">           <LikeBlog postId={post?.id ?? ""} /> </span>
                                                    </span>
                                                    <span className="flex items-center p-2 ">
                                                        <span className="ml-2 text-lg">{post.comments?.length ?? 0} Comments <FontAwesomeIcon icon={faComment} /></span>
                                                    </span>
                                                    {post?.type === BlogType.Recruit ? (
                                                        <span className="flex items-center mr-4 pr-4 p-2  hover:bg-slate-200">
                                                            <ListUploadCv blogId={post.id ?? ""} />

                                                        </span>
                                                    ) : (

                                                        <span className="ml-2 text-lg ">{post.blogCvs?.length ?? 0} Uploads <FontAwesomeIcon icon={faPaperclip} /></span>
                                                    )}
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


