'use client'
import  {useEffect, useState} from 'react';
import {projectService} from "@/services/project-service";
import {ReviewManagement} from "@/components/sites/management/review/review-management";


const Page = () => {
    const [projectId, setProjectId] = useState<string | null>();

    useEffect(() => {
        const fetchProjectInfo = async () => {
            const response = await projectService.getProjectInfo()
            if (response.status == 1 && response.data) {
                setProjectId(response.data.id)
            }
        }
        fetchProjectInfo()
    }, []);

    return projectId && <ReviewManagement projectId={projectId} />
};

export default Page;