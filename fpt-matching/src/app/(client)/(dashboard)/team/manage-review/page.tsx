'use client'
import React, {useEffect, useState} from 'react';
import {projectService} from "@/services/project-service";
import {reviewService} from "@/services/review-service";
import {Review} from "@/types/review";
import {ReviewCard} from "@/app/(client)/(dashboard)/team/manage-review/review-card";

const Page = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [projectId, setProjectId] = React.useState<string | null>();

    useEffect(() => {
        const fetchProjectInfo = async () => {
            const response = await projectService.getProjectInfo()
            if (response.status == 1 && response.data) {
                setProjectId(response.data.id)
            }
        }
        fetchProjectInfo()
    }, []);
    useEffect(() => {
        const fetchReview = async () => {
            if(projectId) {
                const response = await reviewService.getReviewByProjectId({projectId: projectId})
                if (response.status == 1 && response.data) {
                    response.data.sort((a, b) => a.number - b.number)
                    setReviews(response.data);
                }
            }
        }
        fetchReview()
    }, [projectId]);
    return (
        <div className={"p-8"}>
           <div className={"flex justify-between"}>
               {reviews && reviews.map((review, index) => (
                   <ReviewCard key={index} review={review} />
               ))}
           </div>
        </div>
    );
};

export default Page;