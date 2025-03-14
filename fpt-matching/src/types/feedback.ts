import { BaseEntity } from "./_base/base";
import { Review } from "./review";

export interface Feedback extends BaseEntity {
    reviewId?: string;
    comment?: string;
    review?: Review;
}