
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

import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blog-service';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import CommentBlog from '@/components/_common/comment/comment';


interface BlogProps {
    id: string;
}

const BlogDetail: React.FC<BlogProps> = ({ id }) =>{
   
    const user = useSelector((state: RootState) => state.user.user)
    const {
        data: result,
        refetch
    } = useQuery({
        queryKey: ["getProjectById"],
        queryFn: () => blogService.fetchById(id),
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        if (id) {
          refetch();
        }
      }, [id, refetch]);

   
    return (
        <div  className='bg-white max-w-3xl mx-3 my-8 p-6 rounded-xl shadow-md  '>
        <div>
          {/* Post Header with Avatar, Username, and Date */}
          <div className="flex items-center space-x-4">
            <img
              src={result?.data?.user?.avatar ?? "/user-avatardefault.jpg"} // Replace with your avatar image
              alt="User Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className='flex w-full justify-between'>
              <div>
                <p className="text-lg font-semibold text-gray-800">{result?.data?.user?.username}</p>
                <p className="text-sm text-gray-500">
                  {result?.data?.createdDate
                    ? new Date(result?.data?.createdDate).toLocaleString("vi-VN", {
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
                  {result?.data?.title}
                </span>
              </ModalTrigger>
              <ModalBody>
                <ModalContent className='w-full max-h-[80vh] overflow-y-auto '>
                  {/* Header - Cố định khi cuộn */}
                  <div className="header-post w-full h-auto border-gray-500 p-4 border-b-2 bg-white dark:bg-black sticky top-0 z-10">
                    <div className="flex justify-center w-full">
                      Bài viết của {result?.data?.user?.username}
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
                          <p className="text-lg font-semibold text-gray-800">{result?.data?.user?.lastName} {result?.data?.user?.firstName}</p>
                          <p className="text-sm text-gray-500">
                            {result?.data?.createdDate
                              ? new Date(result?.data?.createdDate).toLocaleString("vi-VN", {
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
                      {result?.data?.title}
                    </h1>
                    <p className="mt-4 text-gray-700 text-xl px-2 ">
                      {result?.data?.content}
                    </p>

                    {/* Post Stats (Likes, Comments, Upload Count) */}
                    <div className="flex py-3 w-full">
                      <div className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                        <span className="flex items-center">
                          {result?.data?.likes.length ?? 0} lượt thích từ người khác
                        </span>
                        <div className='flex'>
                          <span className="flex items-center">
                            <i className="fas fa-comment text-green-500"></i>
                            <span className="ml-2">{result?.data?.comments.length ?? 0} bình luận  </span>
                          </span>
                          <span className="flex items-center">
                            <i className="fas fa-image text-red-500"></i>
                            <span className="ml-2">{result?.data?.blogCvs.length ?? 0} nộp CV </span>
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
                  <CommentBlog id={result?.data?.id ?? ""} />
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
                <span className="ml-2">    {result?.data?.likes?.length ?? 0}    Likes <FontAwesomeIcon icon={faThumbsUp} /> </span>
              </span>
              <span className="flex items-center">
                <i className="fas fa-comment text-green-500"></i>
                <span className="ml-2">{result?.data?.comments?.length ?? 0} Comments <FontAwesomeIcon icon={faComment} /></span>
              </span>
              <span className="flex items-center">
                <i className="fas fa-image text-red-500"></i>
                <span className="ml-2">{result?.data?.blogCvs?.length ?? 0} Uploads <FontAwesomeIcon icon={faPaperclip} /></span>
              </span>
            </div>
          </div>
        </div>
      </div>

    )
}
export default BlogDetail


