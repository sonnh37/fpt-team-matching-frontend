'use client'

import UpdateTopic from '@/components/sites/management/update-idea/update-idea';
import { useSearchParams } from 'next/navigation';


const Page = () => {
    const searchParams = useSearchParams();
    const topicId = searchParams.get("topicId");
    return topicId ? <UpdateTopic topicId={topicId} /> : <div className={"font-bold text-lg w-full flex justify-center items-center"}>Không có cập nhật từ sinh viên</div>
};

export default Page;