import React, {useEffect, useState} from 'react';
import {reviewService} from "@/services/review-service";
import {Review} from "@/types/review";
import {ReviewCard} from "@/components/sites/management/review/review-card";

export const ReviewManagement = ({projectId} : {projectId: string}) => {
    const [reviews, setReviews] = useState<Review[]>([]);

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