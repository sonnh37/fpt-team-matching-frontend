'use client'

import UpdateIdea from '@/components/sites/management/update-idea/update-idea';
import { useSearchParams } from 'next/navigation';


const Page = () => {
    const searchParams = useSearchParams();
    const ideaId = searchParams.get("ideaId");
    return ideaId ? <UpdateIdea ideaId={ideaId} /> : <div className={"font-bold text-lg w-full flex justify-center items-center"}>Không có cập nhật từ sinh viên</div>
};

export default Page;