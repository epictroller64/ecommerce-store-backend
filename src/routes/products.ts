import { Router, Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { handleServiceResponse, sendValidationErrorResponse, sendInternalErrorResponse } from '../utils/responseUtils';

const router = Router();
const productService = new ProductService();

router.get('/get-products', async (req: Request, res: Response) => {
    try {
        const { pagination, filters } = req.query;
        console.log(`req query: ${JSON.stringify(req.query)}`);
        let paginationData;
        let filterData;

        if (pagination) {
            paginationData = JSON.parse(pagination as string);
        }

        if (filters) {
            filterData = JSON.parse(filters as string);
        }

        const result = await productService.getProducts(paginationData, filterData);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get products error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch products');
    }
});
router.get('/get-best-selling-products', async (req: Request, res: Response) => {
    try {
        const result = await productService.getBestSellingProducts();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get best selling products error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch best selling products');
    }
});

router.get('/get-product', async (req: Request, res: Response) => {
    try {
        const { productId } = req.query;

        if (!productId || typeof productId !== 'string') {
            return sendValidationErrorResponse(res, 'Product ID is required');
        }

        const result = await productService.getProductById(productId);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get product error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch product');
    }
});

export default router; 