"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp,
  faComment,
  faEarthAmericas,
  faPaperclip,
  faUser,
  faVideo,
  faFaceSmile,
  faPhotoFilm,
  faPencil,
  faNoteSticky,
  faShare,
  faCircleUser
} from "@fortawesome/free-solid-svg-icons";
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
  ModalTrigger,
  ModalClose,
  ModalFooter,
} from "@/components/ui/animated-modal";

import {
  Pagination
} from "@/components/ui/pagination"

import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '@/lib/redux/store';
import { blogService } from '@/services/blog-service';
import { BlogGetAllQuery } from '@/types/models/queries/blog/blog-get-all-query';
import CommentBlog from '@/components/_common/comment/comment';
import { toast } from 'sonner';
import { BlogStatus, BlogType } from '@/types/enums/blog';
import { BlogCreateCommand } from '@/types/models/commands/blog/blog-create-command';
import LikeBlog from '@/components/_common/likeblog/like-blog';
import { projectService } from '@/services/project-service';
import { Project } from '@/types/project';
import ProjectInfo from '@/components/_common/projectInfo/project-info';
import UploadCv from '@/components/_common/uploadCv/upload-cv';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import { FaXTwitter, FaFacebookF, FaGithub, FaInstagram, FaTwitch, FaMastodon } from "react-icons/fa6";
import { PiButterflyFill, PiGearSixBold } from 'react-icons/pi';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profilestudentService } from "@/services/profile-student-service";
import { ProfileStudent } from "@/types/profile-student";
import { apiHubsService } from "@/services/api-hubs-service";
import { BlogRecommendations } from "@/types/blog-recommend-model";
import BlogRecommend from '@/components/blogforuser/blog-recommend';


export default function Blog() {


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [projectUser, setProject] = useState<Project>();
  const [postType, setPostType] = useState(BlogType.Share); // Loại bài viết
  const [messageUser, setMessage] = useState<string>(""); // check xem user co prj khong
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    content: "",
    skillRequired: "",
    // type: BlogType.Share, // Loại bài viết
    status: BlogStatus.Public // Trạng thái mặc định
  });
  const [filterType, setFilterType] = useState<BlogType | null>(null);
  const [studentProfile, setStudentProfile] = useState<ProfileStudent | null>(null);
  const [recommendBlogs, setRecommendBlogs] = useState<BlogRecommendations[]>([]);



  // Hàm thay đổi bộ lọc và gọi API lại
  const handleFilterChange = (type: BlogType) => {
    setFilterType(type);
    refetch();
  };
  const handleNoFilter = () => {
    window.location.href = "/social/blog"; // Chuyển hướng về trang chủ
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // const handlePostTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setPostType(Number(e.target.value) as BlogType);
  //   handleChange(e);
  // };
  // tạo blog
  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.content) {
        toast.error("⚠️ Vui lòng nhập tiêu đề hoặc nội dung!");
        return;
      }

      if (!formData.title || formData.title.trim().length < 10) {
        toast.error("⚠️ Tiêu đề phải có ít nhất 10 ký tự!");
        return;
      }

      if (!formData.content || formData.content.trim().length < 10) {
        toast.error("⚠️ Nội dung phải có ít nhất 10 ký tự!");
        return;
      }

      if (!formData.skillRequired || formData.skillRequired.trim().length < 5) {
        toast.error("⚠️ Kỹ năng yêu cầu phải có ít nhất 5 ký tự!");
        return;
      }
      const blognew: BlogCreateCommand = {
        title: formData.title,
        content: formData.content,
        skillRequired: formData.skillRequired,
        type: postType,
        status: formData.status,
        // projectId: projectUser?.id || ""
        ...(formData.projectId ? { projectId: formData.projectId } : {})
      };

      const result = await blogService.create(blognew);

      if (result?.status === 1) {
        toast.success("🎉 Chúc mừng bạn đã tạo blog thành công!");
        refetch(); // Refresh danh sách blog
        setFormData({ projectId: "", title: "", content: "", skillRequired: "", status: BlogStatus.Public }); // Reset form
        setPostType(BlogType.Share); // Reset lại kiểu bài viết
      } else {
        toast.error("🚨 Có lỗi xảy ra khi tạo blog, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo blog:", error);
      toast.error("⚠️ Lỗi hệ thống, vui lòng thử lại sau!");
    }
  };


  //gọi thông tin user đã đăng nhập
  const user = useSelector((state: RootState) => state.user.user)


  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const checkPrj = await projectService.getProjectInfoCheckLeader();
        if (checkPrj.status !== 1) {
          setMessage(checkPrj?.message ?? "");
        }
        if (checkPrj.status === 1) {
          setProject(checkPrj.data)

        }
      } catch (error) {
        console.error("Error fetching project info:", error);
      }
    };
    const fetchProfileStudent = async () => {
      const response = await profilestudentService.getProfileByCurrentUser();
      if (response && response.data) {
        setStudentProfile(response.data);
      }
    }
    fetchProfileStudent();
    fetchProjectInfo();
  }, []);

  useEffect(() => {
    if (studentProfile?.experienceProject) {
      const fetchBlogSuggestion = async () => {
        const response = await apiHubsService.getRecommendBlogs(studentProfile.experienceProject!)
        if (response) {
          setRecommendBlogs(response);
        }
      }
      fetchBlogSuggestion()
    }
  }, [studentProfile]);

  const query: BlogGetAllQuery = {
    pageNumber: currentPage,
    isDeleted: false,
    status: BlogStatus.Public,
    isPagination: true,
  };
  // NẾU NGƯỜI DÙNG BẤM FILTER THÌ MỚI HIỆN RA
  if (filterType) {
    query.type = filterType;
  }
  // //goi api bang tanstack
  //phan trang
  const {
    data: result,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["getBlogAll", query],
    queryFn: () => blogService.getAll(query),
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


  // day la sort blog notifications
  const notification = result?.data?.results ?? [];
  const sortedNotification = [...notification].sort((a, b) => {
    return (b.comments?.length || 0) - (a.comments?.length || 0);
  });

  // day la sort theo type
  const sortFpt = notification.filter(x => x.type === BlogType.Share);


  const sendMessage = async () => {
    toast.error("Đây không phải bài tuyển dụng")
   }

  return (
    <div className='bg-slate-100'>
      <div className='blog-center flex flex-row max-w-screen-2xl h-auto mx-auto bg-[#f5f5f5] '>
        {/* blog left */}
        <div className='blog-left basis-1/5 bg-[#f5f5f5] max-h-fit pl-3 pb-3'>
          <aside className="hidden w-64 md:block min-h-screen">

            <div className="h-[30px] my-40  flex items-center justify-center">
              <DirectionAwareHover
                imageUrl={"https://daihoc.fpt.edu.vn/wp-content/uploads/2022/08/dai-hoc-fpt-tp-hcm-1.jpeg"}>
                <img className='h-20'
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/FPT_Education_logo.svg/1200px-FPT_Education_logo.svg.png"
                  alt="" />
              </DirectionAwareHover>
            </div>

            <nav className="text-[16px] ">
              <ul className="flex flex-col">
                <li className="px-4 cursor-pointer text-gray-800 hover:bg-blue-300  hover:text-white">
                  <a className="py-3 flex items-center" href="/">
                    🏠
                    Trang chủ
                  </a>
                </li>
                <li className="px-4 py-2 text-[12px] uppercase tracking-wider text-gray-500 font-bold">USER
                  MANAGEMENT
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/social/blog/blogmanagement">
                    👥
                    Users
                  </a>
                </li>
                <li className="px-4 py-2 text-[12px] uppercase tracking-wider text-gray-500 font-bold">Blog
                  Management
                </li>
                <li
                  className="px-4 cursor-pointer hover:bg-blue-300"
                >
                  <a className="py-3 flex items-center"
                    onClick={() => handleFilterChange(BlogType.Share)}>
                    ✍️  Blog chia sẻ
                  </a>
                </li>
                <li
                  className="px-4 cursor-pointer hover:bg-blue-300"
                >
                  <a className="py-3 flex items-center"
                    onClick={() => handleFilterChange(BlogType.Recruit)}>
                    🔍 Blog tìm thành viên
                  </a>
                </li>
                <li className="px-4 py-2 mt-2 text-[12px] uppercase tracking-wider text-gray-500 font-bold">Apps</li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a href="#" className="py-2 flex items-center">
                    ✉️
                    Messages
                    <span className="ml-auto text-xs bg-gray-300 px-2 py-1 rounded-sm">16</span>
                  </a>
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a href="blog/notification" className="py-2 flex items-center">
                    🔔
                    Notification
                    <span className="ml-auto text-xs bg-gray-300 px-2 py-1 rounded-sm">16</span>
                  </a>
                </li>
                {/* <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a href="#" className="py-2 flex items-center">
                    📅

                    Calendar
                  </a>
                </li> */}
                <li className="px-4 py-2 text-[12px] uppercase tracking-wider text-gray-500 font-bold">Other</li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="#" className="py-3 flex items-center">
                    ⚠️
                    Privacy Policy
                  </a>
                </li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="#" className="py-3 flex items-center">
                    🔒
                    Term of use
                  </a>
                </li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="/about" className="py-3 flex items-center gap-2">
                    💡
                    <span>About</span>
                  </a>
                </li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="https://www.facebook.com/ThanhThu03" className="py-3 flex items-center">
                    📧
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            <div className="p-6 min-h-20 flex flex-col items-start">
              {/* Icons */}
              <div className="flex flex-wrap gap-4 text-gray-700 text-xl">
                <FaXTwitter />
                <FaFacebookF />
                <FaGithub />
                <FaInstagram />
                <FaTwitch />
                <FaMastodon />
                <PiButterflyFill />
              </div>

              {/* My Tags */}
              <div className=" flex mt-3 w-full  justify-between gap-2">
                <p className="font-semibold text-lg">My Tags</p>
                <PiGearSixBold className="text-gray-700 text-xl" />
              </div>
            </div>

            <div className="py-3 mt-6 text-2xl items-start bg-white border-b-2 mb-6 mt-5 mx-3  px-3 w-full">
              <div className="font-bold text-xl">DEV Community is a community of 2,827,832 amazing
                developers
              </div>
              <div className='text-sm mt-2'>a place where coders share, stay up-to-date and grow their
                careers.
              </div>

              {!user?.id && (
                <>
                  <a href="">
                    <div
                      className="Login w-full mt-2 text-center border-2 p-1 text-xl border-blue-700 hover:bg-blue-700 hover:text-white hover:underline">
                      Login
                    </div>
                  </a>
                  <a href="">
                    <div
                      className="Register w-full mt-2 text-center p-1 text-xl hover:bg-blue-200 hover:underline">
                      Register
                    </div>
                  </a>
                </>
              )}

            </div>


          </aside>
        </div>
        {/* blog center */}
        <div className='blog-center flex flex-col items-center basis-3/5 mr-4 ml-4'>
          {/* Form tạo blog */}
          <div className='form-create-blog bg-white rounded-xl w-full max-w-3xl p-3 mx-2 mt-3'>


            <Modal>
              <ModalTrigger className='w-full'>
                <div className="flex items-center ">
                  <img
                    src={user?.avatar || "/user-avatardefault.jpg"}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div
                    className="shadow appearance-none bg-slate-200 border rounded-xl w-full py-2 px-3 ml-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-start ">
                    {user?.firstName} ơi, bạn đang nghĩ gì thế?
                  </div>
                </div>


                <div className="flex my-3 border-b-2  border-gray-400 px-6"></div>
                <div className="flex mt-3 ">
                  <div className="flex space-x-4 justify-center w-full">
                    <button className="text-red-500 hover:text-gray-800 w-1/2">
                      <FontAwesomeIcon icon={faVideo} />
                      <span> </span>
                      Bài tuyển thành viên
                    </button>
                    {/* <button className=" hover:text-gray-800 w-1/4">
                  <FontAwesomeIcon icon={faPhotoFilm} />
                  <span> </span>
                  Ảnh/video
                </button> */}
                    <button className="text-green-600 hover:text-gray-800 w-1/2">
                      <FontAwesomeIcon icon={faFaceSmile} />
                      <span> </span>
                      Bài chia sẻ cảm xúc/hoạt động
                    </button>
                  </div>
                </div>


              </ModalTrigger>

              <ModalBody className='min-h-[60%] max-h-[90%] md:max-w-[40%]'>
                <ModalContent>
                  <div className="header-blog mb-4 py-4 border-b-slate-100 h-1/6 bg-[#ff9240]">
                    <h4 className='text-lg md:text-2xl text-white dark:text-neutral-100 font-bold text-center'>
                      Tạo bài viết mới
                    </h4>
                  </div>
                  <div className='body-blog w-full h-4/5'>
                    <div className='headerbody pb-4 gap-2 flex items-center w-full h-1/4 px-3'>
                      {/*<img*/}
                      {/*  src={user?.avatar || "/user-avatardefault.jpg"}*/}
                      {/*  alt="Avatar"*/}
                      {/*  className="w-12 h-12 rounded-full"*/}
                      {/*/>*/}
                      <Avatar>
                        <AvatarImage src="/user-avatardefault.jpg" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className='w-full ml-3'>
                        <div className=' '>
                          <p className="text-lg font-semibold text-gray-800">
                            <FontAwesomeIcon
                              icon={faUser} /> {user?.lastName} {user?.firstName}</p>
                        </div>

                        <Select value={postType.toString()}
                          defaultValue={BlogType.Share.toString()}
                          onValueChange={(e) => {
                            setPostType(parseInt(e))
                            setFormData((prev) => ({
                              ...prev,
                              [status]: parseInt(e),
                            }));
                          }}>
                          <SelectTrigger className={"w-1/3"}>
                            <SelectValue placeholder="Chọn thể loại" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Chọn thể loại</SelectLabel>
                              <SelectItem value={BlogType.Share.toString()}>Đăng chia
                                sẻ</SelectItem>
                              <SelectItem value={BlogType.Recruit.toString()}>Đăng tìm
                                thành viên</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="body px-4 mt-3 h-3/4 flex flex-col gap-4">
                      {/* Tiêu đề */}
                      <div className="flex items-center gap-4">
                        <div className="w-1/5 flex items-center">
                          <h3 className="text-nowrap"><FontAwesomeIcon icon={faPencil} className="pr-1.5" /> Tiêu đề:</h3>
                        </div>
                        <div className="w-3/5">
                          <Input
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Nhập tựa đề ở đây"
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Nội dung */}
                      <div className="flex items-center gap-4">
                        <div className="w-1/5 flex items-center">
                          <h3 className="text-nowrap"><FontAwesomeIcon icon={faNoteSticky} className="pr-1.5" /> Nội dung:</h3>
                        </div>
                        <div className="w-3/5">
                          <Textarea
                            name="content"
                            placeholder="Viết nội dung ở đây."
                            value={formData.content}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>

                      {/* Nếu chọn "Đăng tìm thành viên" thì hiển thị thêm field nhập */}
                      {postType === BlogType.Recruit && user?.projects ? (
                        <div>
                          {/* Kỹ năng yêu cầu */}
                          <div className="flex items-center gap-4">
                            <div className="w-1/5 flex items-center">
                              <h3 className="text-nowrap">Kỹ năng yêu cầu:</h3>
                            </div>
                            <div className="w-3/5">
                              <Textarea
                                name="skillRequired"
                                placeholder="Viết kỹ năng yêu cầu ở đây."
                                value={formData.skillRequired}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                          </div>

                          {/* Team của bạn */}
                          <div className="flex items-start gap-4 mt-4 min-h-28">
                            <div className="w-1/5 flex flex-col p-2">
                              <h3 className="text-nowrap">Team của bạn:</h3>

                            </div>
                            <div className="w-3/5">
                              {/* {!projectUser?.id ? (
                                <h4 className="text-red-400 text-sm mt-2">*Không có nhóm</h4>
                              ):(
                                <div className="w-3/5 p-2">
                                   {projectUser?.teamName}
                              </div>
                              )} */}
                                        <Select
                                name="projectId"
                                value={formData.projectId}
                                defaultValue={undefined}
                                onValueChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    projectId: e,
                                  }));
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn dự án" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Dự án của bạn</SelectLabel>
                                    {projectUser?.id && (
                                      <SelectItem value={projectUser.id}>{projectUser.teamName}</SelectItem>
                                    )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {!projectUser?.id && (
                                <h4 className="text-red-400 text-sm mt-2">*Không có nhóm</h4>
                              )}
                              <h4 className="text-red-400 text-sm">*Không bắt buộc</h4>
                              <h4 className="text-red-400 text-sm">{messageUser}</h4>
                            </div>
                          </div>
                        </div>
                      ) : ( 
                        <div></div>
                      )}
                    </div>


                  </div>
                </ModalContent>
                <ModalFooter>
                  <div
                    className='flex w-full h-14 sticky bottom-0  items-center justify-center'>
                    <button onClick={() => handleSubmit()}
                      className='bg-blue-500 h-3/4 w-1/3 mx-2 rounded-xl hover:bg-blue-400 hover:text-black  mt-2 mb-4'>Post
                      Bài
                    </button>
                  </div>
                </ModalFooter>
              </ModalBody>


            </Modal>


          </div>
          {/* filter blog */}
          <div className='blog-center flex w-full justify-center'>
            <div className="mt-6 flex-row bg-white min-w-[760px] max-w-3xl mx-3 my-2 p-4 pb-2 rounded-xl ">
              <div className='flex justify-between  pb-1'>
                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold">Bài viết</h2>

                {/* Nút chức năng */}
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-gray-100">
                    <span className="text-lg">⚙</span> Bộ lọc
                  </button>
                  <button
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium border rounded-md hover:bg-gray-100">
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


          {/* Cho show blog all */}
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {
                  result?.data?.results?.map((post) => (
                    // Cho blog detail

                    <div key={post.id}
                      className='bg-white max-w-3xl mx-3 my-5 p-6 pb-3 rounded-xl shadow-md min-w-[760px] '>
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
                                  : "Không có ngày "} <span> </span>
                                <FontAwesomeIcon icon={faEarthAmericas} />
                              </p>

                            </div>
                            <div>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  className='text-xl'>...</DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Ghim blog</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>


                        {/* Post Title */}
                        <div
                          className="text-lg md:text-xl font-bold text-gray-900 leading-tight pt-3 mt-2">
                          <Modal>
                            <ModalTrigger className="text-xl  ">
                              <div className='hover:text-orange-300 text-left'>
                                <div
                                  className='text-left '> {post?.type === BlogType.Recruit && (
                                    <div>[🔎Đăng tuyển,tìm thành viên]</div>)}</div>
                                <span
                                  className={` ${post?.type === BlogType.Recruit ? "text-none font-medium text-lg" : ""}`}>
                                  {post.title}
                                </span></div>

                              <p className="text-left text-base font-medium line-clamp-2 overflow-hidden break-all max-w-[680px] relative after:content-['...Xem_thêm'] after:text-blue-500 after:absolute after:bottom-0 after:right-0 after:bg-white after:hover:underline">
                                {post?.content}
                              </p>


                            </ModalTrigger>
                            <ModalBody>
                              <ModalContent
                                className='w-full max-h-[80vh] overflow-y-auto '>
                                {/* Header - Cố định khi cuộn */}
                                <div
                                  className="header-post w-full h-auto border-gray-500 p-4 border-b-2 bg-white dark:bg-black sticky top-0 z-10">
                                  <div className="flex justify-center w-full">
                                    Bài viết của {post?.user?.username}
                                  </div>
                                  <ModalClose
                                    className="absolute top-2 right-2">X</ModalClose>
                                </div>
                                <div className='body-blogdetail'>
                                  <div className="flex items-center space-x-4 p-2">
                                    <img
                                      src={post.user?.avatar || "/user-avatardefault.jpg"} // Replace with your avatar image
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
                                            : "Không có ngày "}
                                          <FontAwesomeIcon
                                            icon={faEarthAmericas} /></p>
                                      </div>
                                      <div className='setting-blog'>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger
                                            className='text-xl'>...</DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            <DropdownMenuLabel>My
                                              Account</DropdownMenuLabel>
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
                                    {post?.type === BlogType.Recruit && (
                                      <div>🔥🔎</div>)} {post?.title}
                                  </h1>
                                  <p className="mt-2 font-normal text-base md:text-lg text-gray-700 px-4 break-words whitespace-normal">
                                    {post?.content}
                                  </p>

                                  {post?.type === BlogType.Recruit && (

                                    <div><h4 className='text-lg px-4 mt-1'>Kỹ năng
                                      yêu cầu :</h4>
                                      <div
                                        className="mt-1 text-gray-700 font-medium text-base px-4 ">
                                        {post?.skillRequired ?? "Hiện tại chưa có."}
                                        {/* <getByProjectId id={post?.id}/> */}
                                        <h4 className='text-lg mt-1 font-bold  text-gray-900'>Thông
                                          tin của team :</h4>
                                        <ProjectInfo id={post.projectId ?? ""} />
                                      </div>
                                    </div>


                                  )}

                                  {/* Post Stats (Likes, Comments, Upload Count) */}
                                  <div className="flex py-3 w-full">
                                    <div
                                      className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                                      <span className="flex items-center ml-3">
                                        <LikeBlog postId={post?.id ?? ""} />
                                      </span>
                                      <div className='flex'>
                                        <span className="flex items-center">
                                          <i className="fas fa-comment text-green-500"></i>
                                          <span className="ml-2">{post?.comments.length ?? 0} bình luận  </span>
                                        </span>
                                        <span
                                          className="flex items-center mr-3">
                                          <i className="fas fa-image text-red-500"></i>
                                          <span className="ml-2">{post?.blogCvs.length ?? 0} nộp CV </span>
                                        </span>
                                      </div>

                                    </div>
                                  </div>
                                </div>


                                {/* Post Stats (Likes, Comments, Upload Count) */}
                                <div
                                  className="flex w-full text-gray-600 border-y-2 p-3">
                                  <div
                                    className="flex w-full text-base justify-between  items-center space-x-4">
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
                          <div
                            className="flex justify-between items-center  w-full space-x-4">
                            <span className="flex items-center ml-4 pl-4 p-2 hover:bg-slate-200">
                              <span className="ml-2 text-base">           <LikeBlog postId={post?.id ?? ""} /> </span>
                            </span>
                            <span className="flex items-center p-2 ">
                              <span className="ml-2 text-base">{post.comments?.length ?? 0} Comments <FontAwesomeIcon
                                icon={faComment} /></span>
                            </span>
                            {(post?.type === BlogType.Recruit && post?.projectId) ? (
                              <span
                                className="ml-2 text-base p-2   hover:bg-slate-200">
                                <UploadCv blogId={post.id ?? ""} />

                              </span>
                            ) : (

                              <button onClick={() =>sendMessage() }
                                className="ml-2 text-base ">{post.blogCvs?.length ?? 0} Uploads <FontAwesomeIcon
                                  icon={faPaperclip} /></button>
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
        {/* blog right */}
        <div className='blog-right basis-1/5 mr-6 min-w-[180px]'>
          {/* <div className='box-qcao'>
            <div className=" w-full relative max-w-xs mx-3 m-3">
              <div className="h-[4rem] relative  flex items-center justify-center">
                <DirectionAwareHover imageUrl={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmZDDiSOnUm5PwmDRXejARSnlrrsvu6e9Qhw&s"} children={undefined}>
                  <p className="font-bold text-xl">In the mountains</p>
                  <p className="font-normal text-sm">$1299 / night</p>
                </DirectionAwareHover>
              </div>
            </div>
          </div> */}

          <div className="py-3 text-2xl items-start  w-full">
            <h3 className='text-lg mb-1 ml-1'>Được tài trợ</h3>
            <div className="flex text-sm hover:bg-gray-200">
              <div><img
                src="https://yt3.googleusercontent.com/NgFT6lwJNt9040g74VOq-yLNukcKJtq5AhJV4Pwzv7fp7jU4foWqfhx6RUg9MHxNZPU1kasF7g=s900-c-k-c0x00ffffff-no-rj"
                className='h-32 w-32 p-1' /></div>
              <div className='flex flex-col justify-center ml-2'>
                <a href="https://fptshop.com.vn/" className='text-base font-semibold'>Cửa hàng FPT</a>
                <p className=''>https://fptshop.com.vn</p>
              </div>
            </div>
            <div className="flex text-sm mt-2 hover:bg-gray-200">
              <div className=''><img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx9E56U-LUmsx2Kln8a4ZLcH-9eSJeBoLACw&s"
                className='h-32 w-32 p-1' /></div>
              <div className='flex flex-col justify-center ml-2'>
                <a href="https://daihoc.fpt.edu.vn/" className='text-base font-semibold'>Tuyển sinh ĐH
                  FPT</a>
                <p className=''>https://daihoc.fpt.edu.vn</p>
              </div>
            </div>
          </div>
          <div className='box-title'>
            <div className=" w-full relative max-w-xs mx-3 m-3">
              <div
                className="relative shadow-xl bg-white border border-gray-200   py-4 h-full overflow-hidden rounded-md flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-semibold'># 🧐 Những bài viết gợi ý</h1>
                    <p className="font-normal text-xm text-gray-700 px-4 py-2  ">
                      Đây là những bài viết gợi ý dựa trên CV của bạn.
                    </p>
                  </div>
                </div>
                {
                  recommendBlogs.slice(0, 4).map((blog) => {
                    return (
                      <div key={blog.blog_id}
                        className='w-full flex justify-center items-center h-auto border-b-2 border-gray-200 px-2 pt-2'>
                        <div className='recommend flex'>
                          <h2 className="font-bold  text-gray-700 mb-2 ">
                            <Modal>
                              <ModalTrigger>
                                <div className='w-full text-left'>
                                  {blog.job}
                                </div>
                                <span className='font-normal mt-1'>Tỉ lệ tương đồng: {blog.similarity.toFixed(2) * 100}%</span>

                              </ModalTrigger>
                              <BlogRecommend id={blog.blog_id} />
                            </Modal>

                          </h2>
                          {/*<p className='text-xm text-gray-500'>{postNt.comments.length ?? 0} comments</p>*/}
                        </div>
                      </div>
                    )
                  })
                }
                <div className=" px-4 py-1 rounded-lg ">
                  Explore
                </div>
                {/* Meaty part - Meteor effect */}
                {/* <Meteors number={20} /> */}
              </div>
            </div>
          </div>

          <div className='box-info'>
            <div className=" w-full relative max-w-xs mx-3 m-3">
              <div
                className="relative shadow-xl bg-white border border-gray-200   py-4 h-full overflow-hidden rounded-md flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-semibold'># 🔔 Notification</h1>
                    <p className="font-normal text-xm text-gray-700 px-4 py-2  ">
                      Hóng hớt drama trường FPT thân yêu
                    </p>
                  </div>
                </div>
                {sortedNotification.slice(0, 4).map((blogfpt, index) => (

                  <div className='w-full h-auto border-b-2 border-gray-200 px-5 py-2'>
                    <div className=''>
                      <h2 className="font-bold  text-gray-700  ">
                        <Modal >
                          <ModalTrigger >
                            <div className='hover:text-orange-300 text-left'>  <div className='text-left '> {blogfpt?.type === BlogType.Recruit && (<div>[🔎Đăng tuyển,tìm thành viên]</div>)}</div>
                              <span className={` ${blogfpt?.type === BlogType.Recruit ? "text-none font-medium text-lg" : "text-lg"}`}>
                                {blogfpt.title}
                              </span> </div>



                          </ModalTrigger>
                          <ModalBody>
                            <ModalContent className='w-full max-h-[80vh] overflow-y-auto '>
                              {/* Header - Cố định khi cuộn */}
                              <div className="header-post w-full h-auto border-gray-500 p-4 border-b-2 bg-white dark:bg-black sticky top-0 z-10">
                                <div className="flex justify-center w-full">
                                  Bài viết của {blogfpt?.user?.username}
                                </div>
                                <ModalClose className="absolute top-2 right-2">X</ModalClose>
                              </div>
                              <div className='body-blogdetail'>
                                <div className="flex items-center space-x-4 p-2">
                                  <img
                                    src={blogfpt.user?.avatar || "/user-avatardefault.jpg"} // Replace with your avatar image
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full"
                                  />
                                  <div className='flex w-full justify-between'>
                                    <div>
                                      <p className="text-lg font-semibold text-gray-800">{blogfpt?.user?.lastName} {blogfpt?.user?.firstName}</p>
                                      <p className="text-sm text-gray-500">
                                        {blogfpt?.createdDate
                                          ? new Date(blogfpt.createdDate).toLocaleString("vi-VN", {
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
                                  {blogfpt?.type === BlogType.Recruit && (<div>🔥🔎</div>)} {blogfpt?.title}
                                </h1>
                                <p className="mt-2 font-normal text-base md:text-lg text-gray-700 px-4 ">
                                  {blogfpt?.content}
                                </p>

                                {blogfpt?.type === BlogType.Recruit && (

                                  <div>  <h4 className='text-lg px-4 mt-1'>Kỹ năng yêu cầu :</h4>
                                    <div className="mt-1 text-gray-700 font-medium text-base px-4 ">
                                      {blogfpt?.skillRequired ?? "Hiện tại chưa có."}
                                      {/* <getByProjectId id={post?.id}/> */}
                                      <h4 className='text-lg mt-1 font-bold  text-gray-900'>Thông tin của team :</h4>
                                      <ProjectInfo id={blogfpt.projectId ?? ""} />
                                    </div>
                                  </div>


                                )}

                                {/* Post Stats (Likes, Comments, Upload Count) */}
                                <div className="flex py-3 w-full">
                                  <div className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                                    <span className="flex items-center ml-3">
                                      <LikeBlog postId={blogfpt?.id ?? ""} />
                                    </span>
                                    <div className='flex'>
                                      <span className="flex items-center">
                                        <i className="fas fa-comment text-green-500"></i>
                                        <span className="ml-2">{blogfpt?.comments.length ?? 0} bình luận  </span>
                                      </span>
                                      <span className="flex items-center mr-3">
                                        <i className="fas fa-image text-red-500"></i>
                                        <span className="ml-2">{blogfpt?.blogCvs.length ?? 0} nộp CV </span>
                                      </span>
                                    </div>

                                  </div>
                                </div>
                              </div>



                              {/* Post Stats (Likes, Comments, Upload Count) */}
                              <div className="flex w-full text-gray-600 border-y-2 p-3">
                                <div className="flex w-full text-base justify-between  items-center space-x-4">
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
                              <CommentBlog id={blogfpt.id ?? ""} />
                            </ModalContent>

                          </ModalBody>
                        </Modal>
                      </h2>
                      <p className='text-xm pl-2 text-gray-500'>  {blogfpt.comments.length ?? 0} Comment</p>
                    </div>
                  </div>
                ))}

                <div className=" px-4 py-1 rounded-lg ">
                  Explore
                </div>
                {/* Meaty part - Meteor effect */}
                {/* <Meteors number={20} /> */}
              </div>
            </div>
          </div>

          <div className='w-full box-trending mt-2 ml-4 bg-white border-gray-200 rounded-lg  shadow-xl'
          >
            <div className='w-full h-auto  px-3 py-3'>

              <div className='text-black  text-lg font-semibold pl-11 border-b-2 pb-2 border-gray-200 '>🔥🔥 Trending 🔥🔥</div>
              {/*Handle load recommend*/}
              {sortedNotification.slice(0, 4).map((postNt, index) => (
                <div className='title-trending pl-6  hover:bg-gray-100 hover:text-blue-900 '>

                  <div className=''>
                    <h2 className="font-bold  text-gray-700  ">
                      <Modal >
                        <ModalTrigger >
                          <div className='hover:text-orange-300 text-left'>
                            <span className={" font-medium text-lg"}>
                              {index + 1}. {postNt.title}
                            </span> </div>
                        </ModalTrigger>
                        <ModalBody>
                          <ModalContent className='w-full max-h-[80vh] overflow-y-auto '>
                            {/* Header - Cố định khi cuộn */}
                            <div className="header-post w-full h-auto border-gray-500 p-4 border-b-2 bg-white dark:bg-black sticky top-0 z-10">
                              <div className="flex justify-center w-full">
                                Bài viết của {postNt?.user?.username}
                              </div>
                              <ModalClose className="absolute top-2 right-2">X</ModalClose>
                            </div>
                            <div className='body-blogdetail'>
                              <div className="flex items-center space-x-4 p-2">
                                <img
                                  src={postNt.user?.avatar || "/user-avatardefault.jpg"} // Replace with your avatar image
                                  alt="User Avatar"
                                  className="w-12 h-12 rounded-full"
                                />
                                <div className='flex w-full justify-between'>
                                  <div>
                                    <p className="text-lg font-semibold text-gray-800">{postNt?.user?.lastName} {postNt?.user?.firstName}</p>
                                    <p className="text-sm text-gray-500">
                                      {postNt?.createdDate
                                        ? new Date(postNt.createdDate).toLocaleString("vi-VN", {
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
                                {postNt?.type === BlogType.Recruit && (<div>🔥🔎</div>)} {postNt?.title}
                              </h1>
                              <p className="mt-2 font-normal text-base md:text-lg text-gray-700 px-4 ">
                                {postNt?.content}
                              </p>

                              {postNt?.type === BlogType.Recruit && (

                                <div>  <h4 className='text-lg px-4 mt-1'>Kỹ năng yêu cầu :</h4>
                                  <div className="mt-1 text-gray-700 font-medium text-base px-4 ">
                                    {postNt?.skillRequired ?? "Hiện tại chưa có."}
                                    {/* <getByProjectId id={post?.id}/> */}
                                    <h4 className='text-lg mt-1 font-bold  text-gray-900'>Thông tin của team :</h4>
                                    <ProjectInfo id={postNt.projectId ?? ""} />
                                  </div>
                                </div>


                              )}

                              {/* Post Stats (Likes, Comments, Upload Count) */}
                              <div className="flex py-3 w-full">
                                <div className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                                  <span className="flex items-center ml-3">
                                    <LikeBlog postId={postNt?.id ?? ""} />
                                  </span>
                                  <div className='flex'>
                                    <span className="flex items-center">
                                      <i className="fas fa-comment text-green-500"></i>
                                      <span className="ml-2">{postNt?.comments.length ?? 0} bình luận  </span>
                                    </span>
                                    <span className="flex items-center mr-3">
                                      <i className="fas fa-image text-red-500"></i>
                                      <span className="ml-2">{postNt?.blogCvs.length ?? 0} nộp CV </span>
                                    </span>
                                  </div>

                                </div>
                              </div>
                            </div>



                            {/* Post Stats (Likes, Comments, Upload Count) */}
                            <div className="flex w-full text-gray-600 border-y-2 p-3">
                              <div className="flex w-full text-base justify-between  items-center space-x-4">
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
                            <CommentBlog id={postNt.id ?? ""} />
                          </ModalContent>

                        </ModalBody>
                      </Modal>
                    </h2>
                  </div>


                </div>

              ))}
            </div>

          </div>
        </div>
      </div>

    </div>

  )
}

