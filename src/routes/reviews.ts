import { Router, Request, Response } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';
import { handleServiceResponse, sendValidationErrorResponse, sendInternalErrorResponse } from '../utils/responseUtils';
import { reviewService } from '../services';

const router = Router();

router.get('/get-reviews', async (req: Request, res: Response) => {
    try {
        const { productId } = req.query;
        if (!productId || typeof productId !== 'string') {
            return sendValidationErrorResponse(res, 'Product ID is required');
        }
        const result = await reviewService.getReviews(productId);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get reviews error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch reviews');
    }
});

router.post('/create-review', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendValidationErrorResponse(res, 'User authentication required');
        }

        const { productId, rating, comment } = req.body;
        if (!productId || !rating) {
            return sendValidationErrorResponse(res, 'Product ID and rating are required');
        }
        //validate rating between 1 and 5
        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return sendValidationErrorResponse(res, 'Rating must be an integer between 1 and 5');
        }

        const reviewData = {
            userId: req.user.id,
            productId,
            rating,
            comment: comment || null
        };

        const result = await reviewService.createReview(reviewData);
        handleServiceResponse(res, result, 201);
    } catch (error) {
        console.error('Create review error:', error);
        sendInternalErrorResponse(res, 'Failed to create review');
    }
});

export default router; 