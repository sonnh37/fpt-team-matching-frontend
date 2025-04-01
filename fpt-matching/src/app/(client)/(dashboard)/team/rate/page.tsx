"use client"
import { RootState } from '@/lib/redux/store';
import { ProjectStatus } from '@/types/enums/project';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useSelector } from 'react-redux';

export default function Page() {
        //gọi thông tin user đã đăng nhập
        const user = useSelector((state: RootState) => state.user.user)

        const project = user?.projects.find(x=> x.isDeleted = false && x.status == ProjectStatus.InProgress)

        const{
            data: result,
            refetch
        } = useQuery({
            queryKey: ["getBlogAllById", query],
            queryFn: () => bl.fetchPaginated(query),
            refetchOnWindowFocus: false,
        });
        

    return (
        
        <form className="max-w-md mx-auto mt-16 p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Form đánh giá</h2>

            {/* Name Field */}
            <div className="mb-4">
                <label htmlFor="name" className="block mb-1">Tên người đánh giá</label>
                <div 
                    id="name" 
                    className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                >{user?.email}</div>
            </div>

            {/* Email Field */}
            <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Người nhận đánh giá</label>
                <select 
              
                    className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                >
                    <option value="">Xin mời lựa chọn</option>
                    <option value="">Bạn A</option>
                </select>
            </div>

            {/* Rating Field */}
            <div className="mb-4">
                <label className="block mb-1">Đánh giá</label>
                <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="flex items-center space-x-1">
                            <input 
                                type="radio" 
                                name="rating" 
                                id={`rating${num}`} 
                                value={num} 
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor={`rating${num}`}>{num}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Field */}
            <div className="mb-4">
                <label htmlFor="message" className="block mb-1">Đóng góp ý kiến</label>
                <textarea 
                    id="message" 
                    className="w-full py-2 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Submit
            </button>
        </form>
    );
}
