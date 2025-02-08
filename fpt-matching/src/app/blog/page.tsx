
"use client"
import React, { useState } from 'react';


export default function Blog() {

  const [post, setPost] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic khi submit form
    console.log('Post submitted:', post);
  };

  return (
    <div className='blog-center flex flex-row'>
      <div className='blog-left basis-1/4 bg-slate-300'> a </div>
      <div className='blog-center basis-1/2 '>
        <div className='form-create-blog'>
          <form onSubmit={handleSubmit}>
            <div className="flex mb-4">
              <img className="" src="" alt="avatar" />
              <input
                id="post"
                className="shadow appearance-none bg-slate-200   border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder=" Quan đi, bạn đang nghĩ gì thế?"
                value={post}
                onChange={(e) => setPost(e.target.value)}
              ></input>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Đăng
              </button>
              <div className="flex space-x-4">
                <button className="text-gray-600 hover:text-gray-800">
                  Video trực tiếp
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  Ảnh/video
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                  Cảm xúc/hoạt động
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='blog-right basis-1/4 bg-yellow-200'> c</div>
    </div>
  )
}


