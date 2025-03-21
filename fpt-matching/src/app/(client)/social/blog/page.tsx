
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
export default function Blog() {


  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [postType, setPostType] = useState(BlogType.Share); // Loại bài viết
  const [formData, setFormData] = useState({
    projectId: ""  ,
    title: "",
    content: "",
    skillRequired: "",
    // type: BlogType.Share, // Loại bài viết
    status: BlogStatus.Public // Trạng thái mặc định
  });
  const [filterType, setFilterType] = useState<BlogType | null>(null);

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


  // chỗ check user coi có project chưa 
  const checkProjectUser = user?.projects.find(x=> x.isDeleted === false && x.teamMembers.find(u => u.userId === user.id));

  let query: BlogGetAllQuery = { pageNumber: currentPage };
  // NẾU NGƯỜI DÙNG BẤM FILTER THÌ MỚI HIỆN RA
  if (filterType) {
    query.type = filterType;
  }
  // //goi api bang tanstack
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
    <div className='bg-slate-200'>
      <div className='blog-center flex flex-row max-w-screen-2xl h-auto mx-auto bg-slate-200 '>
        {/* blog left */}
        <div className='blog-left basis-1/5 bg-slate-200'>
          <aside className="hidden w-64 md:block min-h-screen">
            <div className="py-3 text-2xl items-start bg-white border-b-2 mb-6 mt-5 mx-3  px-3">
              <div className="font-bold text-xl">DEV Community is a community of 2,827,832 amazing developers</div>
              <div className='text-sm mt-2'>We're a place where coders share, stay up-to-date and grow their careers.</div>
              <a href="">
                <div className='Login w-full mt-2 text-center border-2 p-1 text-xl border-blue-700 hover:bg-blue-700 hover:text-white hover:underline'> Login</div>
              </a>
              <a href="">
                <div className='Register w-full mt-2 text-center  p-1 text-xl  hover:bg-blue-200 hover:underline'> Register</div>
              </a>
            </div>
            <nav className="text-sm ">
              <ul className="flex flex-col">
                <li className="px-4 cursor-pointer bg-gray-500 text-gray-800 hover:bg-blue-300  hover:text-white">
                  <a className="py-3 flex items-center" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                    Trang chủ
                  </a>
                </li>
                <li className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">USER MANAGEMENT</li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    Users
                  </a>
                </li>
                <li className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">Blog Management</li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/blog/blogmanagerment">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                    </svg>

                    Blog Cá nhân
                  </a>
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                    Blog Sharing
                  </a>
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a className="py-3 flex items-center" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                    </svg>
                    Blog Project
                  </a>
                </li>
                <li className="px-4 py-2 mt-2 text-xs uppercase tracking-wider text-gray-500 font-bold">Apps</li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a href="#" className="py-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                    </svg>

                    Messages
                    <span className="ml-auto text-xs bg-gray-500 px-2 py-1 rounded-sm">16</span>
                  </a>
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a href="blog/notification" className="py-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                    </svg>

                    Notification
                    <span className="ml-auto text-xs bg-gray-500 px-2 py-1 rounded-sm">16</span>
                  </a>
                </li>
                <li className="px-4 cursor-pointer hover:bg-blue-300">
                  <a href="#" className="py-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>

                    Calendar
                  </a>
                </li>
                <li className="px-4 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">Other</li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="#" className="py-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                    Privacy Policy
                  </a>
                </li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="#" className="py-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                    Term of use
                  </a>
                </li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="#" className="py-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                    About
                  </a>
                </li>
                <li className="px-4 hover:bg-blue-300">
                  <a href="#" className="py-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 mr-3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
        {/* blog center */}
        <div className='blog-center flex flex-col items-center basis-3/5 mr-4 ml-4'>
          <div className='form-create-blog bg-slate-100 rounded-xl w-full max-w-3xl p-3 mx-2 mt-3'>

            <div className="flex items-center space-x-3">
              <img
                src="/meo.jpg"
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <Modal>
                <ModalTrigger className='w-full'>
                  <div className="shadow appearance-none bg-slate-200 border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-start ">
                    {user?.firstName} đi, bạn đang nghĩ gì thế?
                  </div>

                </ModalTrigger>

                <ModalBody className='min-h-[60%] max-h-[90%] md:max-w-[40%]'>
                  <ModalContent >
                    <div className="header-blog mb-4 py-4 border-b-2 h-1/5">
                      <h4 className='text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center' >
                        Tạo bài viết của bạn đi
                      </h4>
                    </div>
                    <div className='body-blog w-full h-4/5'>
                      <div className='headerbody  flex items-center w-full h-1/4'>
                        <img
                          src={user?.avatar ?? "/user-avatardefault.jpg"} // Replace with your avatar image
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full"
                        />
                        <div className='w-full ml-3 '>
                          <div className=' '>
                            <p className="text-lg font-semibold text-gray-800">{user?.lastName} {user?.firstName}</p>
                          </div>
                          <select
                            name="type"
                            className="border p-2 rounded"
                            value={postType}
                            onChange={handlePostTypeChange}
                          >
                            <option value={BlogType.Share}>Đăng chia sẻ</option>
                            <option value={BlogType.Recruit}>Đăng tìm thành viên</option>
                          </select>
                        </div>
                      </div>
                      <div className='body mt-3 h-3/4'>
                        <div className='flex'>
                          <div className='w-1/4 items-center p-2'>
                            <h3 >Tiêu đề</h3>
                          </div>
                          <input className=' w-3/4' type="text"
                            value={formData.title}
                            name="title"
                            onChange={handleChange}
                            placeholder='Nhập tựa đề ở đây' />
                        </div>
                        <div className='flex mt-2 h-full'>
                          <div className='w-1/4 items-center p-2 '>
                            <h3 >Nội dung</h3>
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
                            <div className='flex mt-2 h-full'>
                            <div className='w-1/4 items-center p-2 '>
                                <h3 >Team của bạn</h3>
                              </div>
                              <div className="w-3/4 border p-2 rounded"> aa</div>
                            </div>
                          </div>

                        ) : (
                          <div></div>
                        )}
                      </div>
                      <div className='flex w-full h-14 absolute bottom-0  items-center justify-center'>
                        <button onClick={() => handleSubmit()} className='bg-blue-500 h-3/4 w-full mx-2 hover:bg-blue-400 hover:text-gray-400 '>Post Bài</button>
                      </div>
                    </div>
                  </ModalContent>
                </ModalBody>

              </Modal>
            </div>

            <div className="flex ">

              <div className="flex space-x-4 justify-center w-full">
                <button className="text-red-500 hover:text-gray-800">
                  Video trực tiếp
                </button>
                <button className="text-green-600 hover:text-gray-800">
                  Ảnh/video
                </button>
                <button className="text-yellow-600 hover:text-gray-800">
                  Cảm xúc/hoạt động
                </button>
              </div>
            </div>

          </div>
          {/* filter blog */}
          <div className='header-button  pt-3'>
            <div className='header-button pt-3'>
              <span
                className={` mx-1 px-2 hover:bg-white hover:text-blue-900 ${filterType === null ? "font-extrabold" : ""}`}
                onClick={() => handleNoFilter()}
              >
                Liên quan
              </span>
              <span
                className={`px-2 hover:bg-white hover:text-blue-900 ${filterType === BlogType.Share ? "font-extrabold" : ""}`}
                onClick={() => handleFilterChange(BlogType.Share)}
              >
                Chia sẻ
              </span>
              <span
                className={`px-2 hover:bg-white hover:text-blue-900 ${filterType === BlogType.Recruit ? "font-extrabold" : ""}`}
                onClick={() => handleFilterChange(BlogType.Recruit)}
              >
                Tìm thành viên
              </span>
            </div>
          </div>
          {/* Blog */}
          <div className='bg-white max-w-3xl mx-3 my-8 p-6 rounded-xl shadow-md  '>
            <div>
              {/* Post Header with Avatar, Username, and Date */}
              <div className="flex items-center space-x-4">
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
              </div>


              {/* Post Title */}
              <div className="text-3xl font-semibold text-gray-800 mt-6">
                <Modal>
                  <ModalTrigger className="font-bold text-black ">
                    <span className="  ">
                      Một trong những dòng Sport Bike hot hit nhà Ducati, thì phải nhắc đến Panigale 899.
                    </span>
                  </ModalTrigger>
                  <ModalBody>
                    <ModalContent className='w-full max-h-[80vh] overflow-y-auto '>
                      {/* Header - Cố định khi cuộn */}
                      <div className="header-post w-full h-auto border-gray-500 p-4 border-b-2 bg-white dark:bg-black sticky top-0 z-10">
                        <div className="flex justify-center w-full">
                          Bai viet cua thang nao do
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
                              <p className="text-lg font-semibold text-gray-800">Nguyễn Toàn</p>
                              <p className="text-sm text-gray-500">4 giờ trước  <FontAwesomeIcon icon={faEarthAmericas} /> </p>
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
                        <h1 className=" px-2 ">
                          Một trong những dòng Sport Bike hot hit nhà Ducati, thì phải nhắc đến Panigale 899.
                        </h1>
                        <p className="mt-4 text-gray-700 text-xl px-2 ">

                          Với dáng vẻ đầy uy lực cá tính, cùng với khối động cơ L-twin 898cc Superquadro sản xuất công suất 148 mã lực và mô-men xoắn 99 Nm – Panigale 899 mau chóng nhận được rất nhiều sự yêu thích của các Biker.
                        </p>

                        {/* Post Stats (Likes, Comments, Upload Count) */}
                        <div className="flex py-3 w-full">
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
                      </div>

                    </ModalContent>
                    <ModalFooter className="justify-start w-full h-auto">
                      <div className='flex w-full'>
                        <img
                          src="/user-avatardefault.jpg" // Replace with your avatar image
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="relative w-full">
                          <textarea
                            className="w-full px-2 py-2 pr-10 border rounded-md resize-none"
                            placeholder="Hãy làm người văn minh đi"
                          ></textarea>

                          {/* Nút Send nằm góc phải dưới */}
                          <button className="absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600">
                            <FontAwesomeIcon icon={faPaperPlane} /> Send
                          </button>
                        </div>
                      </div>
                    </ModalFooter>

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
                                        <LikeBlog postId={post?.id ?? ""} />
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
                                      <span className="ml-2">  <FontAwesomeIcon icon={faThumbsUp}  />  Lượt thích </span>
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
                              <span className="ml-2">           <LikeBlog postId={post?.id ?? ""} /> </span>
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
        {/* blog right */}
        <div className='blog-right basis-1/5'>
          <div className='box-title'>
            <div className=" w-full relative max-w-xs mx-3 m-3">
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
              <div className="relative shadow-xl bg-gray-100 border border-gray-200   py-4 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-extrabold'># Discuss</h1>
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
                      <p className='text-xm'>{postNt.comments.length ?? 0} comments</p>
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
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r transform scale-[0.80] rounded-full blur-3xl" />
              <div className="relative shadow-xl bg-gray-100 border border-gray-200   py-4 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black'># Notification</h1>
                    <p className="font-normal text-xm text-gray-700 px-4 py-2  ">
                      hong hot drama truong fpt
                    </p>
                  </div>
                </div>
                {sortFpt.slice(0, 4).map((blogfpt, index) => (

                  <div className='w-full h-auto border-b-2 border-gray-200 px-5 py-2'>
                    <div className=''>
                      <h2 className="font-bold  text-gray-700 mb-2 ">
                        {blogfpt.title}
                      </h2>
                      <p className='text-xm'>  {blogfpt.comments.length ?? 0} Comment</p>
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
              <div className='text-black font-extrabold '>Trending</div>
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


