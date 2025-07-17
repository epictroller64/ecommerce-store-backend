import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { productRatings } from "../db/schema";
import { ApiResponse, createErrorResponse, createSuccessResponse, NewProductRating, ProductRating } from "../types";



export class ReviewService {
    async createReview(review: NewProductRating): Promise<ApiResponse<ProductRating>> {
        const [newReview] = await db.insert(productRatings).values(review).returning();
        if (!newReview) {
            return createErrorResponse('FAILED_TO_CREATE_REVIEW', 'Failed to create review');
        }
        return createSuccessResponse(newReview, 'Review created successfully');
    }

    async getReviews(productId: string): Promise<ApiResponse<ProductRating[]>> {
        const reviews = await db.select().from(productRatings).where(eq(productRatings.productId, productId));
        return createSuccessResponse(reviews, 'Reviews retrieved successfully');
    }
}