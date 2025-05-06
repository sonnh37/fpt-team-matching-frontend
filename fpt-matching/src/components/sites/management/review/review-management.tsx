import React, {useEffect, useState} from 'react';
import {reviewService} from "@/services/review-service";
import {Review} from "@/types/review";
import {ReviewCard} from "@/components/sites/management/review/review-card";
import {capstoneService} from "@/services/capstone-service";
import { CapstoneSchedule } from '@/types/capstone-schedule';
import { CapstoneScheduleCard } from './capstone-schedule-card';

export const ReviewManagement = ({projectId} : {projectId: string}) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [capstoneSchedules, setCapstoneSchedules] = useState<CapstoneSchedule[]>([]);
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
        const fetchCapstoneSchedule = async () => {
            if (projectId) {
                const response = await capstoneService.getByProjectId({projectId: projectId})
                if (response.status == 1 && response.data) {
                    response.data.sort((a, b) => a.stage! - b.stage!)
                    setCapstoneSchedules(response.data);
                }
            }
        }
        fetchCapstoneSchedule()
        fetchReview()
    }, [projectId]);
    return (
        <div className={"p-8"}>
            <div className={"flex gap-6 flex-wrap"}>
                {reviews && reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                ))}
                {
                    capstoneSchedules && capstoneSchedules.length > 0 && capstoneSchedules.map(capstoneSchedule => (
                        <CapstoneScheduleCard key={capstoneSchedule.id} capstoneSchedule={capstoneSchedule} />
                    ))
                }
            </div>
        </div>
    );
};