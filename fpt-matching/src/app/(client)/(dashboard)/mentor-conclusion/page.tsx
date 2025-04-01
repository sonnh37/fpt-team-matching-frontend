import React from 'react';
import { useSearchParams } from "next/navigation";
const Page = () => {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");

    return (
        <div>
            Page
        </div>
    );
};

export default Page;