import { BaseEntity } from "./_base/base";
import { Review } from "./review";

export interface Feedback extends BaseEntity {
    reviewId?: string;
    content?: string;
    description?: string;
    fileUpload?: string;
    review?: Review;
}