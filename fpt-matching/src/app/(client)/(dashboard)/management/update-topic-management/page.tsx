'use client'
import React from 'react';
import {TopicVersionRequest} from "@/types/topic-version-request";
import {topicVersionRequestService} from "@/services/topic-version-request-service";
import {
    TopicVersionRequestCard
} from "@/components/sites/management/topic-version-request-card/topic-version-request-card";

const Page = () => {
    const [topicVersionRequest, setTopicVersionRequest] = React.useState<TopicVersionRequest[]>([])
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await topicVersionRequestService.getByRole("Manager");
            if (response.data) {
                setTopicVersionRequest(response.data);
            }
        }
        fetchData();
    }, []);

    return (
        <div className={"flex flex-row gap-4 px-4 py-8 flex-wrap"}>
            {
                topicVersionRequest.map((topicVersionRequest, index) => (
                    <TopicVersionRequestCard key={index} topicVersionRequest={topicVersionRequest} />
                ))
            }
        </div>
    )
};

export default Page;