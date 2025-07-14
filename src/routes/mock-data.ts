import { Router, Request, Response } from 'express';
import { handleServiceResponse, sendValidationErrorResponse, sendInternalErrorResponse } from '../utils/responseUtils';
import { MockDataService } from '../services/mock-data.service';

const router = Router();
const mockDataService = new MockDataService();

router.post('/generate-categories', async (req: Request, res: Response) => {
    try {
        const { count = 10 } = req.body;

        if (typeof count !== 'number' || count < 1 || count > 100) {
            return sendValidationErrorResponse(res, 'Count must be a number between 1 and 100');
        }

        const result = await mockDataService.generateCategories(count);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Generate categories error:', error);
        sendInternalErrorResponse(res, 'Failed to generate categories');
    }
});

router.post('/generate-products', async (req: Request, res: Response) => {
    try {
        const { count = 50, categoryIds } = req.body;

        if (typeof count !== 'number' || count < 1 || count > 500) {
            return sendValidationErrorResponse(res, 'Count must be a number between 1 and 500');
        }

        const result = await mockDataService.generateProducts(count, categoryIds);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Generate products error:', error);
        sendInternalErrorResponse(res, 'Failed to generate products');
    }
});

router.post('/generate-all', async (req: Request, res: Response) => {
    try {
        const { categoryCount = 10, productCount = 50 } = req.body;

        if (typeof categoryCount !== 'number' || categoryCount < 1 || categoryCount > 100) {
            return sendValidationErrorResponse(res, 'Category count must be a number between 1 and 100');
        }

        if (typeof productCount !== 'number' || productCount < 1 || productCount > 500) {
            return sendValidationErrorResponse(res, 'Product count must be a number between 1 and 500');
        }

        const result = await mockDataService.generateAll(categoryCount, productCount);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Generate all mock data error:', error);
        sendInternalErrorResponse(res, 'Failed to generate mock data');
    }
});

router.delete('/clear-all', async (req: Request, res: Response) => {
    try {
        const result = await mockDataService.clearAll();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Clear all mock data error:', error);
        sendInternalErrorResponse(res, 'Failed to clear mock data');
    }
});

export default router; 