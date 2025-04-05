'use client'

import UpdateIdea from '@/components/sites/management/update-idea/update-idea';
import { useSearchParams } from 'next/navigation';


const Page = () => {
    const searchParams = useSearchParams();
    const ideaId = searchParams.get("ideaId");
    return ideaId && <UpdateIdea ideaId={ideaId} />
};

export default Page;