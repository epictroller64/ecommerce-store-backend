import { Router, Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { handleServiceResponse, sendInternalErrorResponse } from '../utils/responseUtils';

const router = Router();
const categoryService = new CategoryService();

router.get('/get-categories', async (req: Request, res: Response) => {
    try {
        const result = await categoryService.getAllCategories();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get categories error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch categories');
    }
});

export default router; 