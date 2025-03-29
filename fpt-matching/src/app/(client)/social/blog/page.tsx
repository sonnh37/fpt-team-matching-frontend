
"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faEarthAmericas, faPaperclip, faUser, faVideo, faFaceSmile, faPhotoFilm, faPencil, faNoteSticky, faShareFromSquare, faComments, faHouse, faShare, faCircleUser, faMessage } from "@fortawesome/free-solid-svg-icons";
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
import {
  Pagination
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Meteors } from '@/components/ui/meteors'
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '@/lib/redux/store';
import { blogService } from '@/services/blog-service';
import { BlogGetAllQuery } from '@/types/models/queries/blog/blog-get-all-query';
import CommentBlog from '@/components/_common/comment/comment';
import { toast } from 'sonner';
import { BlogStatus, BlogType } from '@/types/enums/blog';
import BlogDetail from '../../../../components/_common/blogdetail/blog-detail';
import { BlogCreateCommand } from '@/types/models/commands/blog/blog-create-command';
import LikeBlog from '@/components/_common/likeblog/like-blog';
import { isExists } from 'date-fns';
import { projectService } from '@/services/project-service';
import { Project } from '@/types/project';
import ProjectInfo from '@/components/_common/projectInfo/project-info';
import UploadCv from '@/components/_common/uploadCv/upload-cv';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import { FaXTwitter, FaFacebookF, FaGithub, FaInstagram, FaTwitch, FaMastodon } from "react-icons/fa6";
import { PiButterflyFill, PiGearSixBold } from 'react-icons/pi';





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


  console.log("tét", formData)

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
  const handlePostTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPostType(Number(e.target.value) as BlogType);
    handleChange(e);
  };
  // tạo blog
  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.content) {
        toast.error("⚠️ Vui lòng nhập tiêu đề và nội dung!");
        return;
      }

      const blognew: BlogCreateCommand = {
        title: formData.title,
        content: formData.content,
        skillRequired: formData.skillRequired,
        type: postType,
        status: formData.status,
        projectId: formData.projectId
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

    fetchProjectInfo();
  }, []);



  let query: BlogGetAllQuery = {
    pageNumber: currentPage,
    isDeleted: false
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



  // day la sort blog notification
  const notification = result?.data?.results ?? [];
  const sortedNotification = [...notification].sort((a, b) => {
    return (b.comments?.length || 0) - (a.comments?.length || 0);
  });

  // day la sort theo type
  const sortFpt = notification.filter(x => x.type === BlogType.Share);







  return (
    <div className='bg-slate-100'>
      <div className='blog-center flex flex-row max-w-screen-2xl h-auto mx-auto bg-[#f5f5f5] '>
        {/* blog left */}
        <div className='blog-left basis-1/5 bg-[#f5f5f5] bg-orange-400 max-h-fit pl-3 pb-3'>
          <aside className="hidden w-64 md:block min-h-screen">

            <div className="h-[30px] my-40  flex items-center justify-center">
              <DirectionAwareHover imageUrl={"https://daihoc.fpt.edu.vn/wp-content/uploads/2022/08/dai-hoc-fpt-tp-hcm-1.jpeg"}>
                <img className='h-20' src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/FPT_Education_logo.svg/1200px-FPT_Education_logo.svg.png" alt="" />
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
                <li className="px-4 py-2 text-[12px] uppercase tracking-wider text-gray-500 font-bold">USER MANAGEMENT</li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/">
                    👥
                    Users
                  </a>
                </li>
                <li className="px-4 py-2 text-[12px] uppercase tracking-wider text-gray-500 font-bold">Blog Management</li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/social/blog/blogmanagerment">
                    😀

                    Blog Cá nhân
                  </a>
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/">
                    🖇   Blog Sharing
                  </a>
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/">
                    📖
                    Blog Project
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
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a href="#" className="py-2 flex items-center">
                    📅

                    Calendar
                  </a>
                </li>
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
                  <a href="#" className="py-3 flex items-center">
                    💡   About
                  </a>
                </li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="#" className="py-3 flex items-center">
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
      


          </aside>
        </div>
        {/* blog center */}
        <div className='blog-center flex flex-col items-center basis-3/5 mr-4 ml-4'>
          {/* Form tạo blog */}
          <div className='form-create-blog bg-white rounded-xl w-full max-w-3xl p-3 mx-2 mt-3'>

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
                            value={postType}
                            onChange={handlePostTypeChange}
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
                            value={formData.title}
                            name="title"
                            onChange={handleChange}
                            placeholder='Nhập tựa đề ở đây' />
                        </div>
                        <div className='flex mt-2 h-full'>
                          <div className='w-1/4 items-center p-2 '>
                            <h3 ><FontAwesomeIcon icon={faNoteSticky} /> Nội dung</h3>
                          </div>
                          <textarea className='w-3/4 h-40'
                            value={formData.content}
                            name="content"
                            onChange={handleChange}
                            placeholder='Viết nội dung ở đây' />
                        </div>
                        {/* Nếu chọn "Đăng tìm thành viên" thì hiển thị thêm field nhập */}
                        {postType === BlogType.Recruit && user?.projects ? (
                          <div className=''>
                            <div className='skill'>
                              <div className='flex mt-2 h-full'>
                                <div className='w-1/4 items-center p-2 '>
                                  <h3 >Kỹ năng yêu cầu</h3>
                                </div>
                                <textarea className="w-3/4 border p-2 rounded"
                                  name="skillRequired"
                                  placeholder="Nhập kỹ năng yêu cầu"
                                  value={formData.skillRequired}
                                  onChange={handleChange} />
                              </div>
                            </div>
                            <div className='project py-2'>

                              <div className='flex mt-2 h-full mb-4 min-h-28'>
                                <div className='w-1/4 items-center p-2  '>
                                  <h3 >Team của bạn</h3>
                                </div>
                                <div>
                                  <h4 className='text-red-400'>*Không bắt buộc</h4>
                                  <h4 className='text-red-400'>{messageUser}</h4>

                                  <select
                                    name="projectId" className="border p-2 rounded w-48"
                                    value={formData.projectId || ""}  // Đảm bảo không bị undefined
                                    onChange={handleChange}
                                  >
                                    <option value="">Chọn dự án</option>
                                    {projectUser?.id && (
                                      <option value={projectUser.id}>{projectUser.teamName}</option>
                                    )}
                                  </select>

                                </div>
                              </div>
                            </div>
                          </div>



                        ) : (
                          <div></div>
                        )}
                      </div>
                      <div className='flex w-full h-14 absolute bottom-0  items-center justify-center'>
                        <button onClick={() => handleSubmit()} className='bg-blue-500 h-3/4 w-1/3 mx-2 rounded-xl hover:bg-blue-400 hover:text-black '>Post Bài</button>
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
          {/* filter blog */}
          <div className='blog-center flex w-full justify-center'>
            <div className="mt-6 flex-row bg-white min-w-[760px] max-w-3xl mx-3 my-2 p-4 pb-2 rounded-xl ">
              <div className='flex justify-between  pb-1'>
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
          {/* Blog */}
          {/* <div className='bg-white max-w-3xl mx-3 my-8 p-6 rounded-xl shadow-md  '>
            <div> */}
          {/* Post Header with Avatar, Username, and Date */}
          {/* <div className="flex items-center space-x-4">
                <img
                  src="/user-avatardefault.jpg" // Replace with your avatar image
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className='flex w-full justify-between'>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">Nguyễn Toàn</p>
                    <p className="text-sm text-gray-500">4 giờ trước  <FontAwesomeIcon icon={faEarthAmericas} /> </p>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className='text-xl'>...</DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Xóa blog</DropdownMenuItem>
                        <DropdownMenuItem>Edit blog</DropdownMenuItem>
                        <DropdownMenuItem>Ghim blog</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div> */}


          {/* Post Title */}
          {/* <div className="text-3xl font-semibold text-gray-800 mt-6"> */}
          {/* <Modal> */}
          {/* <ModalTrigger className="font-bold text-black ">
                    <span className="  ">
                      Một trong những dòng Sport Bike hot hit nhà Ducati, thì phải nhắc đến Panigale 899.
                    </span>
                  </ModalTrigger> */}
          {/* <ModalBody> */}
          {/* <ModalContent className='w-full max-h-[80vh] overflow-y-auto '> */}
          {/* Header - Cố định khi cuộn */}
          {/* <div className="header-post w-full h-auto border-gray-500 p-4 border-b-2 bg-white dark:bg-black sticky top-0 z-10">
                        <div className="flex justify-center w-full">
                          Bai viet cua thang nao do
                        </div>
                        <ModalClose className="absolute top-2 right-2">X</ModalClose>
                      </div> */}
          {/* <div className='body-blogdetail'> */}
          {/* <div className="flex items-center space-x-4 p-2"> */}
          {/* <img
                            src="/user-avatardefault.jpg" // Replace with your avatar image
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full"
                          /> */}
          {/* <div className='flex w-full justify-between'> */}
          {/* <div>
                              <p className="text-lg font-semibold text-gray-800">Nguyễn Toàn</p>
                              <p className="text-sm text-gray-500">4 giờ trước  <FontAwesomeIcon icon={faEarthAmericas} /> </p>
                            </div> */}
          {/* <div className='setting-blog'>
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

                            </div> */}
          {/* </div> */}

          {/* </div> */}
          {/* Post Content */}
          {/* <h1 className=" px-2 ">
                          Một trong những dòng Sport Bike hot hit nhà Ducati, thì phải nhắc đến Panigale 899.
                        </h1>
                        <p className="mt-4 text-gray-700 text-xl px-2 ">

                          Với dáng vẻ đầy uy lực cá tính, cùng với khối động cơ L-twin 898cc Superquadro sản xuất công suất 148 mã lực và mô-men xoắn 99 Nm – Panigale 899 mau chóng nhận được rất nhiều sự yêu thích của các Biker.
                        </p> */}

          {/* Post Stats (Likes, Comments, Upload Count) */}
          {/* <div className="flex py-3 w-full">
                          <div className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                            <span className="flex items-center">
                              28 lượt thích từ người khác
                            </span>
                            <div className='flex'>
                              <span className="flex items-center">
                                <i className="fas fa-comment text-green-500"></i>
                                <span className="ml-2">10 bình luận  </span>
                              </span>
                              <span className="flex items-center">
                                <i className="fas fa-image text-red-500"></i>
                                <span className="ml-2">+16 nộp CV </span>
                              </span>
                            </div>

                          </div>
                        </div> */}
          {/* </div> */}



          {/* Post Stats (Likes, Comments, Upload Count) */}
          {/* <div className="flex w-full text-gray-600 border-y-2 p-3">
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
                      </div> */}

          {/* Post Comment */}
          {/* <div className='blog-comment'>
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
                        <div className='comment-content w-full px-3 pt-1'>
                          <div className='account flex p-2'>
                            <div className='img pr-1'>
                              <img
                                src="/user-avatardefault.jpg" // Replace with your avatar image
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                              />
                            </div>
                            <div className='comment-account '>
                              <div className=' h-auto bg-gray-200 border-3 p-2 rounded-xl max-w-[800px]'>
                                <div className='account-name font-bold text-sm'> Son Ngu Ngoc</div>
                                <div className='comment w-full h-auto text-sm text-gray-500'>
                                  aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa
                                </div>
                              </div>
                              <div className='account-time text-xs pl-1'>
                                1 tuần trước
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
                        <div className='comment-content w-full px-3 pt-1'>
                          <div className='account flex p-2'>
                            <div className='img pr-1'>
                              <img
                                src="/user-avatardefault.jpg" // Replace with your avatar image
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                              />
                            </div>
                            <div className='comment-account '>
                              <div className=' h-auto bg-gray-200 border-3 p-2 rounded-xl max-w-[800px]'>
                                <div className='account-name font-bold text-sm'> Son Ngu Ngoc</div>
                                <div className='comment w-full h-auto text-sm text-gray-500'>
                                  aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa
                                </div>
                              </div>
                              <div className='account-time text-xs pl-1'>
                                1 tuần trước
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
                        <div className='comment-content w-full px-3 pt-1'>
                          <div className='account flex p-2'>
                            <div className='img pr-1'>
                              <img
                                src="/user-avatardefault.jpg" // Replace with your avatar image
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                              />
                            </div>
                            <div className='comment-account '>
                              <div className=' h-auto bg-gray-200 border-3 p-2 rounded-xl max-w-[800px]'>
                                <div className='account-name font-bold text-sm'> Son Ngu Ngoc</div>
                                <div className='comment w-full h-auto text-sm text-gray-500'>
                                  aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa
                                </div>
                              </div>
                              <div className='account-time text-xs pl-1'>
                                1 tuần trước
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
                        <div className='comment-content w-full px-3 pt-1'>
                          <div className='account flex p-2'>
                            <div className='img pr-1'>
                              <img
                                src="/user-avatardefault.jpg" // Replace with your avatar image
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full"
                              />
                            </div>
                            <div className='comment-account '>
                              <div className=' h-auto bg-gray-200 border-3 p-2 rounded-xl max-w-[800px]'>
                                <div className='account-name font-bold text-sm'> Son Ngu Ngoc</div>
                                <div className='comment w-full h-auto text-sm text-gray-500'>
                                  aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa    aaaaaaaaaaaaaaaaaaaaaa
                                </div>
                              </div>
                              <div className='account-time text-xs pl-1'>
                                1 tuần trước
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
                      </div> */}

          {/* </ModalContent> */}
          {/* <ModalFooter className="justify-start w-full h-auto"> */}
          {/* <div className='flex w-full'> */}
          {/* <img
                          src="/user-avatardefault.jpg" // Replace with your avatar image
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="relative w-full">
                          <textarea
                            className="w-full px-2 py-2 pr-10 border rounded-md resize-none"
                            placeholder="Hãy làm người văn minh đi"
                          ></textarea> */}

          {/* Nút Send nằm góc phải dưới */}
          {/* <button className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600">
                            <FontAwesomeIcon icon={faPaperPlane} /> Send
                          </button> */}
          {/* </div>
                      </div> */}
          {/* </ModalFooter> */}

          {/* </ModalBody> */}
          {/* </Modal> */}
          {/* </div> */}
          {/* <div className="relative w-full py-5 flex items-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-[2px] bg-gray-300 blur-md"></div>
                </div>
                <div className="relative w-full h-[2px] bg-gray-500"></div>
              </div> */}
          {/* Post Stats (Likes, Comments, Upload Count) */}
          {/* <div className="flex justify-between mt-1 text-gray-600">
                <div className="flex  items-center space-x-4">
                  <span className="flex items-center">
                    <i className="fas fa-thumbs-up text-blue-500"></i>
                    <span className="ml-2">28 Likes <FontAwesomeIcon icon={faThumbsUp} /> </span>
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-comment text-green-500"></i>
                    <span className="ml-2">10 Comments <FontAwesomeIcon icon={faComment} /></span>
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-image text-red-500"></i>
                    <span className="ml-2">+16 Uploads <FontAwesomeIcon icon={faPaperclip} /></span>
                  </span>
                </div>
              </div> */}
          {/* </div>
          </div> */}


          {/* Cho show blog all */}
          <div>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                {
                  result?.data?.results?.map((post) => (
                    // Cho blog detail

                    <div key={post.id} className='bg-white max-w-3xl mx-3 my-5 p-6 pb-3 rounded-xl shadow-md min-w-[650px] '>
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
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>


                        {/* Post Title */}
                        <div className="text-lg md:text-xl font-bold text-gray-900 leading-tight pt-3 mt-2">
                          <Modal>
                            <ModalTrigger className="text-xl  ">
                              <div className='hover:text-orange-300 text-left'>  <div className='text-left '> {post?.type === BlogType.Recruit && (<div>[🔎Đăng tuyển,tìm thành viên]</div>)}</div>
                                <span className={` ${post?.type === BlogType.Recruit ? "text-none font-medium text-lg" : ""}`}>
                                  {post.title}
                                </span> </div>

                              <p className="text-left text-base font-medium line-clamp-2 overflow-hidden relative after:content-['...Xem_thêm'] after:text-blue-500 after:absolute after:bottom-0 after:right-0 after:bg-white after:cursor-pointer after:hover:underline">
                                {post?.content}
                              </p>

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
                              <span className="ml-2 text-base">           <LikeBlog postId={post?.id ?? ""} /> </span>
                            </span>
                            <span className="flex items-center p-2 ">
                              <span className="ml-2 text-base">{post.comments?.length ?? 0} Comments <FontAwesomeIcon icon={faComment} /></span>
                            </span>
                            {post?.type === BlogType.Recruit ? (
                              <span className="flex items-center mr-4 pr-4 p-2  hover:bg-slate-200">
                                <UploadCv blogId={post.id ?? ""} />

                              </span>
                            ) : (

                              <span className="ml-2 text-base ">{post.blogCvs?.length ?? 0} Uploads <FontAwesomeIcon icon={faPaperclip} /></span>
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
                <div className="py-3 mt-6 text-2xl items-start bg-white border-b-2 mb-6 mt-5 mx-3  px-3">
              <div className="font-bold text-xl">DEV Community is a community of 2,827,832 amazing developers</div>
              <div className='text-sm mt-2'>We're a place where coders share, stay up-to-date and grow their careers.</div>

              {!user?.id && (
                <>
                  <a href="">
                    <div className="Login w-full mt-2 text-center border-2 p-1 text-xl border-blue-700 hover:bg-blue-700 hover:text-white hover:underline">
                      Login
                    </div>
                  </a>
                  <a href="">
                    <div className="Register w-full mt-2 text-center p-1 text-xl hover:bg-blue-200 hover:underline">
                      Register
                    </div>
                  </a>
                </>
              )}

            </div>
          <div className='box-title'>
            <div className=" w-full relative max-w-xs mx-3 m-3">
              <div className="absolute inset-0 h-full w-full  rounded-md " />
              <div className="relative shadow-xl bg-gray-100 border border-gray-200   py-4 h-full overflow-hidden rounded-md flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-semibold'># 💬🧐 Discuss</h1>
                    <p className="font-normal text-xm text-gray-700 px-4 py-2  ">
                      Discussion threads targeting the whole community
                    </p>
                  </div>
                </div>
                {sortedNotification.slice(0, 4).map((postNt, index) => (

                  <div className='w-full h-auto border-b-2 border-gray-200 px-5 py-2'>
                    <div className=''>
                      <h2 className="font-bold  text-gray-700 mb-2 ">
                        {postNt.title}
                      </h2>
                      <p className='text-xm text-gray-500'>{postNt.comments.length ?? 0} comments</p>
                    </div>
                  </div>
                )
                )
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
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r transform scale-[0.80] rounded-md blur-3xl" />
              <div className="relative shadow-xl bg-gray-100 border border-gray-200   py-4 h-full overflow-hidden rounded-md flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-semibold'># 🔔 Notification</h1>
                    <p className="font-normal text-xm text-gray-700 px-4 py-2  ">
                      Hóng hớt drama trường FPT thân yêu
                    </p>
                  </div>
                </div>
                {sortFpt.slice(0, 4).map((blogfpt, index) => (

                  <div className='w-full h-auto border-b-2 border-gray-200 px-5 py-2'>
                    <div className=''>
                      <h2 className="font-bold  text-gray-700 mb-2 ">
                        {blogfpt.title}
                      </h2>
                      <p className='text-xm text-gray-500'>  {blogfpt.comments.length ?? 0} Comment</p>
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

          <div className='box-trending'>
            <div className='w-full h-auto  px-2 py-2'>
              <div className='text-black  text-lg font-semibold'>🔥🔥 Trending</div>
              <div className='title-trending p-3  hover:bg-white hover:text-blue-900 '>
                <h2 className=" mb-2 z-50 w-full ">
                  Thu va Loc sang ngay bi ia chay
                </h2>
              </div>
              <div className='title-trending p-3 w-full hover:bg-white hover:text-blue-900'>
                <h2 className=" mb-2 ">
                  Thu va Loc sang ngay bi ia chay
                </h2>
              </div>
              <div className='title-trending p-3 w-full  hover:bg-white hover:text-blue-900'>
                <h2 className=" mb-2 ">
                  Thu va Loc sang ngay bi ia chay
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div >

  )
}


