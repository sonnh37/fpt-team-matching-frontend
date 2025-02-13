
"use client"
import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Meteors } from '@/components/ui/meteors'

export default function Blog() {

  const [post, setPost] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic khi submit form
    console.log('Post submitted:', post);
  };

  return (
    <div className='bg-slate-300'>
      <div className='blog-center flex flex-row max-w-screen-2xl h-auto mx-auto bg-slate-300 '>
        <div className='blog-left basis-1/6 bg-slate-300'> a </div>
        <div className='blog-center basis-1/2 '>

          <div className='form-create-blog bg-slate-100 rounded-xl w-full max-w-3xl p-3 mx-2'>
            <form onSubmit={handleSubmit}>
              <div className="flex items-center space-x-3">
                <img
                  src="/meo.jpg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <input
                  id="post"
                  className="shadow appearance-none bg-slate-200   border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder=" Quan đi, bạn đang nghĩ gì thế?"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                ></input>
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
            </form>
          </div>
          <div className='header-button flex justify-start pt-3'>
            <span className='font-extrabold mx-1 px-2  hover:bg-white hover:text-blue-900'>Relevant</span>
            <span className=' px-2  hover:bg-white hover:text-blue-900'>Latest</span>
            <span className='px-2  hover:bg-white hover:text-blue-900'>Top</span>
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
      
        </div>
        <div className='blog-right basis-2/6'>
          <div className='box-title'>
            <div className=" w-full relative max-w-xs mx-3 m-3">
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
              <div className="relative shadow-xl bg-gray-100 border border-gray-200   py-4 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
                <div className='w-full border-b-2 border-gray-200   '>
                  <div className=' mx-3'>
                    <h1 className='text-xl text-black font-extrabold'># Discuss</h1>
                    <p className="font-normal text-xm text-gray-700 mb-4  ">
                      Discussion threads targeting the whole community
                    </p>
                  </div>
                </div>
                <div className='w-full h-auto border-b-2 border-gray-200 px-2 py-2'>
                  <div className=''>
                    <h2 className="font-bold  text-gray-700 mb-2 ">
                      Meteors because they&apos;re cool
                    </h2>
                    <p className='text-xm'>20 Comment</p>
                  </div>
                </div>
                <div className='w-full h-auto border-b-2 border-gray-200 px-2 py-2'>
                  <div className=''>
                    <h2 className="font-bold  text-gray-700 mb-2 ">
                      Meme everyday
                    </h2>
                    <p className='text-xm'>20 Comment</p>
                  </div>
                </div>
                <div className='w-full h-auto border-b-2 border-gray-200 px-2 py-2'>
                  <div className=''>
                    <h2 className="font-bold  text-gray-700 mb-2 ">
                      Son sang ngay bi ia chay
                    </h2>
                    <p className='text-xm'>20 Comment</p>
                  </div>
                </div>
                <div className=" px-4 py-1 rounded-lg ">
                  Explore
                </div>
                {/* Meaty part - Meteor effect */}
                <Meteors number={20} />
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
                    <p className="font-normal text-xm text-gray-700 mb-4 ">
                      hong hot drama truong fpt
                    </p>
                  </div>
                </div>
                <div className='w-full h-auto border-b-2 border-gray-200 px-2 py-2'>
                  <div className=''>
                    <h2 className="font-bold  text-gray-700 mb-2 ">
                      Ban A bi lo
                    </h2>
                    <p className='text-xm'>20 Comment</p>
                  </div>
                </div>
                <div className='w-full h-auto border-b-2 border-gray-200 px-2 py-2'>
                  <div className=''>
                    <h2 className="font-bold  text-gray-700 mb-2 ">
                      Ban B bi bong de
                    </h2>
                    <p className='text-xm'>20 Comment</p>
                  </div>
                </div>
                <div className='w-full h-auto border-b-2 border-gray-200 px-2 py-2'>
                  <div className=''>
                    <h2 className="font-bold  text-gray-700 mb-2 ">
                      Thu va Loc sang ngay bi ia chay
                    </h2>
                    <p className='text-xm'>20 Comment</p>
                  </div>
                </div>
                <div className=" px-4 py-1 rounded-lg ">
                  Explore
                </div>
                {/* Meaty part - Meteor effect */}
                <Meteors number={20} />
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

    </div>

  )
}


