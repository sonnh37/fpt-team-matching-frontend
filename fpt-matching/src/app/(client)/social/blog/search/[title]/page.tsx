
"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faEarthAmericas, faPaperclip, faShare, faCircleUser } from "@fortawesome/free-solid-svg-icons";
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
import LikeBlog from '@/components/_common/likeblog/like-blog';
import { projectService } from '@/services/project-service';
import { Project } from '@/types/project';
import ProjectInfo from '@/components/_common/projectInfo/project-info';
import UploadCv from '@/components/_common/uploadCv/upload-cv';
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover';
import { FaXTwitter, FaFacebookF, FaGithub, FaInstagram, FaTwitch, FaMastodon } from "react-icons/fa6";
import { PiButterflyFill, PiGearSixBold } from 'react-icons/pi';
import { useParams } from 'next/navigation';
import { BackgroundLines } from "@/components/ui/background-lines";
import { BlogType } from '@/types/enums/blog';




export default function Search() {
  const { title } = useParams<{ title: string }>(); // Lấy giá trị từ params
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [projectUser, setProject] = useState<Project>();
  const [messageUser, setMessage] = useState<string>(""); // check xem user co prj khong

  const [filterType, setFilterType] = useState<BlogType | null>(null);



  // Hàm thay đổi bộ lọc và gọi API lại
  const handleFilterChange = (type: BlogType) => {
    setFilterType(type);
    refetch();
  };
  const handleNoFilter = () => {
    window.location.href = "/social/blog"; // Chuyển hướng về trang chủ
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
    title: title,
    isDeleted: false,
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
    queryKey: ["getBlogSearch", query],
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


  let query1: BlogGetAllQuery = {
    pageNumber: currentPage,
    isDeleted: false,
    isPagination: false,
  };
  const {
    data: resultall
  } = useQuery({
    queryKey: ["getBlogAll", query1],
    queryFn: () => blogService.getAll(query1),
    refetchOnWindowFocus: false,
  });
  // day la sort blog notifications
  const notification = resultall?.data?.results ?? [];
  const sortedNotification = [...notification].sort((a, b) => {
    return (b.comments?.length || 0) - (a.comments?.length || 0);
  });

  // day la sort theo type
  const sortFpt = notification.filter(x => x.type === BlogType.Share);







  return (
    <div className='bg-slate-100'>
      <div className='blog-center flex flex-row max-w-screen-2xl h-auto mx-auto bg-[#f5f5f5] '>
        {/* blog left */}
        <div className='blog-left basis-1/5 bg-[#f5f5f5] max-h-fit pl-3 pb-3'>
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

            {/*<div className="py-3 mt-6 text-2xl items-start bg-white border-b-2 mb-6 mt-5 mx-3  px-3 w-full">*/}
            {/*  <div className="font-bold text-xl">DEV Community is a community of 2,827,832 amazing developers</div>*/}
            {/*  <div className='text-sm mt-2'>We're a place where coders share, stay up-to-date and grow their careers.</div>*/}

            {/*  {!user?.id && (*/}
            {/*    <>*/}
            {/*      <a href="">*/}
            {/*        <div className="Login w-full mt-2 text-center border-2 p-1 text-xl border-blue-700 hover:bg-blue-700 hover:text-white hover:underline">*/}
            {/*          Login*/}
            {/*        </div>*/}
            {/*      </a>*/}
            {/*      <a href="">*/}
            {/*        <div className="Register w-full mt-2 text-center p-1 text-xl hover:bg-blue-200 hover:underline">*/}
            {/*          Register*/}
            {/*        </div>*/}
            {/*      </a>*/}
            {/*    </>*/}
            {/*  )}*/}

            {/*</div>*/}



          </aside>
        </div>
        {/* blog center */}
        <div className='blog-center flex flex-col items-center basis-3/5 mr-4 ml-4'>
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

          {/* Cho show blog all */}
          {result?.data != null && result.status == 1 ? (
            <div>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {
                    result?.data?.results?.map((post) => (
                      // Cho blog detail
                      <div key={post.id} className='bg-white max-w-3xl mx-3 my-5 p-6 pb-3 rounded-xl shadow-md min-w-[760px] '>
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
                                <div className='hover:text-orange-300 text-left'>  <div className='text-left '> {post?.type === BlogType.Recruit && (<div>🔎 Tuyển thành viên</div>)}</div>
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
                                      Bài viết của {post?.user?.firstName} + {post.user?.lastName}
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
                    totalPages={totalPages}f
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          ) : (
            // Nếu không có dữ liệu, hiển thị thông báo hoặc div trống
            <div className="flex items-center mt-10 w-full flex-col px-4">
              <img className='h-64 w-64' src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg" alt="" />
              <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-xl md:text-2xl lg:text-4xl font-sans pt-2  md:py-10 relative z-20 font-bold tracking-tight">
                404 Xin lỗi <br />
                Không tìm thấy kết quả mà bạn tìm kiếm.
              </h2>
              <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
                Bạn có thể kiểm tra lại và nhập từ khóa khác để tìm kiếm.
              </p>
              <a href='/social/blog' className='bg-orange-400 text-white p-3 rounded-sm mt-4 hover: text-orange-400'>TRANG CHỦ</a>
            </div>

          )}


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
              <div><img src="https://yt3.googleusercontent.com/NgFT6lwJNt9040g74VOq-yLNukcKJtq5AhJV4Pwzv7fp7jU4foWqfhx6RUg9MHxNZPU1kasF7g=s900-c-k-c0x00ffffff-no-rj" className='h-32 w-32 p-1' /></div>
              <div className='flex flex-col justify-center ml-2'>
                <a href="https://fptshop.com.vn/" className='text-base font-semibold'>Cửa hàng FPT</a>
                <p className=''>https://fptshop.com.vn</p>
              </div>
            </div>
            <div className="flex text-sm mt-2 hover:bg-gray-200">
              <div className=''><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx9E56U-LUmsx2Kln8a4ZLcH-9eSJeBoLACw&s" className='h-32 w-32 p-1' /></div>
              <div className='flex flex-col justify-center ml-2'>
                <a href="https://daihoc.fpt.edu.vn/" className='text-base font-semibold'>Tuyển sinh ĐH FPT</a>
                <p className=''>https://daihoc.fpt.edu.vn</p>
              </div>
            </div>
          </div>
          <div className='box-title'>
            <div className=" w-full relative max-w-xs mx-3 m-3">
              <div className="absolute inset-0 h-full w-full  rounded-md " />
              <div className="relative shadow-xl bg-white border border-gray-200   py-4 h-full overflow-hidden rounded-md flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-semibold'># 💬🧐 Discuss</h1>
                    <p className="font-normal text-xm text-gray-700 px-4 py-2  ">
                      Discussion threads targeting the whole community
                    </p>
                  </div>
                </div>
                {sortedNotification.slice(0, 4).map((postNt, index) => (

                  <div key={index} className='w-full h-auto border-b-2 border-gray-200 px-5 py-2'>
                    <div className=''>
                      <h2 className="font-bold  text-gray-700  ">
                        <Modal >
                          <ModalTrigger >
                            <div className='hover:text-orange-300 text-left'>  <div className='text-left '> {postNt?.type === BlogType.Recruit && (<div>🔎 Tuyển thành viên</div>)}</div>
                              <span className={` ${postNt?.type === BlogType.Recruit ? "text-none font-medium text-lg" : "text-lg"}`}>
                                {postNt.title}
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
                      <p className='text-xm pl-2 text-gray-500'>  {postNt.comments.length ?? 0} Comment</p>
                    </div>
                  </div>
                )
                )
                }
                <div className=" px-4 py-1 ml-2 rounded-lg ">
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
              <div className="relative shadow-xl bg-white border border-gray-200   py-4 h-full overflow-hidden rounded-md flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-semibold'># 🔔 Notification</h1>
                    <p className="font-normal text-xm text-gray-700 px-4 py-2  ">
                      Hóng hớt drama trường FPT thân yêu
                    </p>
                  </div>
                </div>
                {sortFpt.slice(0, 4).map((blogfpt, index) => (

                  <div key={index} className='w-full h-auto border-b-2 border-gray-200 px-5 py-2'>
                    <div className=''>
                      <h2 className="font-bold  text-gray-700  ">
                        <Modal >
                          <ModalTrigger >
                            <div className='hover:text-orange-300 text-left'>  <div className='text-left '> {blogfpt?.type === BlogType.Recruit && (<div>🔎 Tuyển thành viên</div>)}</div>
                              <span className={` ${blogfpt?.type === BlogType.Recruit ? "text-none font-medium text-lg" : ""}`}>
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


                <div className=" px-4 ml-2 py-1 rounded-lg ">
                  Explore
                </div>
                {/* Meaty part - Meteor effect */}
                {/* <Meteors number={20} /> */}
              </div>
            </div>
          </div>

          <div className='box-trending ml-4 bg-white border-gray-200 rounded-lg  shadow-lg'
          >
            <div className='w-full h-auto  px-3 py-3'>

              <div className='text-black  text-lg font-semibold pl-11'>🔥🔥 Trending 🔥🔥</div>
              <div className='title-trending p-3 pl-6  hover:bg-gray-100 hover:text-blue-900 '>
                <h2 className=" mb-2 z-50 w-full ">
                  1. Thu va Loc sang ngay bi ia chay do ăn gì đó xung quanh trường ?
                </h2>
              </div>
              <div>



              </div>
              <div className='title-trending p-3 pl-6 w-full hover:bg-gray-100 hover:text-blue-900'>
                <h2 className=" mb-2 ">
                  2. Chuyện tình cực hot của 2 nam sinh Sơn Lộc
                </h2>
              </div>
              <div className='title-trending p-3 pl-6 w-full  hover:bg-gray-100 hover:text-blue-900'>
                <h2 className=" mb-2 ">
                  3.  Anh thanh niên đẹp trai quá tài năng tên Q
                </h2>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div >

  )
}


