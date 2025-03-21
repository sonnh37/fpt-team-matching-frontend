import React from 'react'

const BlogTest = () => {
  return (
    <Modal >
    <ModalTrigger className="font-bold text-start text-gray-700 mb-2 px-0  ">
      <p className="  ">
        Một trong những dòng Sport Bike hot hit nhà Ducati, thì phải nhắc đến Panigale 899.
      </p>
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
  )
}

export default BlogTest
