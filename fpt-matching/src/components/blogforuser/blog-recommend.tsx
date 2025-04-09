
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp,
  faComment,
  faEarthAmericas,
  faPaperclip
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
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import LikeBlog from '../_common/likeblog/like-blog';
import CommentBlog from '../_common/comment/comment';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '@/services/blog-service';
import { BlogType } from '@/types/enums/blog';
import ProjectInfo from '../_common/projectInfo/project-info';


interface BlogProps {
  id: string;
}


const BlogRecommend: React.FC<BlogProps> = ({ id }) => {

  const {
    data: result,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["getBlogRecommend", id],
    queryFn: () => blogService.fetchById(id),
    refetchOnWindowFocus: false,
  });


  return (
 
    
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
                src={result?.data?.user?.avatar || "/user-avatardefault.jpg"} // Replace with your avatar image
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
            <h1 className="flex text-xl md:text-2xl font-bold text-gray-900 leading-tight px-4 ">
              {result?.data?.type === BlogType.Recruit && (<div>🔥🔎</div>)} {result?.data?.title}
            </h1>
            <p className="mt-2 font-normal text-base md:text-lg text-gray-700 px-4 ">
              {result?.data?.content}
            </p>

            {result?.data?.type === BlogType.Recruit && (

              <div>  <h4 className='text-lg px-4 mt-1'>Kỹ năng yêu cầu :</h4>
                <div className="mt-1 text-gray-700 font-medium text-base px-4 ">
                  {result?.data?.skillRequired ?? "Hiện tại chưa có."}
                  {/* <getByProjectId id={post?.id}/> */}
                  <h4 className='text-lg mt-1 font-bold  text-gray-900'>Thông tin của team :</h4>
                  <ProjectInfo id={result?.data?.projectId ?? ""} />
                </div>
              </div>


            )}

            {/* Post Stats (Likes, Comments, Upload Count) */}
            <div className="flex py-3 w-full">
              <div className="flex text-xl text-gray-600 justify-between items-center w-full px-2">
                <span className="flex items-center ml-3">
                  <LikeBlog postId={result?.data?.id ?? ""} />
                </span>
                <div className='flex'>
                  <span className="flex items-center">
                    <i className="fas fa-comment text-green-500"></i>
                    <span className="ml-2">{result?.data?.comments.length ?? 0} bình luận  </span>
                  </span>
                  <span className="flex items-center mr-3">
                    <i className="fas fa-image text-red-500"></i>
                    <span className="ml-2">{result?.data?.blogCvs.length ?? 0} nộp CV </span>
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
          <CommentBlog id={result?.data?.id ?? ""} />
        </ModalContent>

      </ModalBody>
    
  )
}

export default BlogRecommend
