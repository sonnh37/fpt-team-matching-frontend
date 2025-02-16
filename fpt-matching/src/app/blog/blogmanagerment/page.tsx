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


export default function Blogmanagement() {

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
                        <div className="relative h-48">
                            <img src="https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722161/AbhirajK/Abhirajk2.webp" alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute -bottom-12 left-6">
                                <img src="https://res.cloudinary.com/djv4xa6wu/image/upload/v1735722163/AbhirajK/Abhirajk%20mykare.webp" alt="Profile" className="w-36 h-36 rounded-xl object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                            </div>
                        </div>

                        <div className="pt-16 px-6 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Abhiraj K</h1>
                                    <p className="text-purple-600 dark:text-purple-400">Node.js Developer & Frontend Expert</p>
                                </div>
                                <a
                                    href="https://abhirajk.vercel.app/"
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
                                    abhirajk@example.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='blog-center flex  w-full justify-center '>
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
        </div>
    )
}


