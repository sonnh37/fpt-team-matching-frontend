"use client"
import React from 'react'
import Loader from '@/components/_common/waiting-icon/page'
const PageIsIdea = () => {
    return (
        <div className='bg-gray-300 flex flex-col justify-center items-center h-screen w-full m-0'>
            <div className='text-3xl text-red-500 pb-4'>Bạn đã tạo idea rồi hãy chờ đợi kết quả duyệt nha</div>
            <div className='text-3xl pb-4 flex items-center justify-center'>
                <button className='bg-slate-50 mr-4'>Xem Duyệt</button>
                <button className='bg-slate-50 ' >Xem gì đó</button>
            </div>
            <div className=''>
               <Loader/>
            </div>
        </div>
    )
}

export default PageIsIdea
