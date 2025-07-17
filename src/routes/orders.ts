import { Router, Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';
import { handleServiceResponse, sendAuthErrorResponse, sendValidationErrorResponse, sendInternalErrorResponse } from '../utils/responseUtils';
import { orderService } from '../services';

const router = Router();

router.post('/create-order', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendAuthErrorResponse(res);
        }

        const result = await orderService.createOrder(req.user.id, req.body);
        handleServiceResponse(res, result, 201);
    } catch (error) {
        console.error('Create order error:', error);
        sendInternalErrorResponse(res, 'Failed to create order');
    }
});

router.get('/get-orders', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendAuthErrorResponse(res);
        }

        const result = await orderService.getOrdersForUser(req.user.id);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get orders error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch orders');
    }
});

router.get('/get-order', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendAuthErrorResponse(res);
        }

        const { orderId } = req.query;

        if (!orderId || typeof orderId !== 'string') {
            return sendValidationErrorResponse(res, 'Order ID is required');
        }

        const result = await orderService.getOrderById(req.user.id, orderId);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get order error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch order');
    }
});

export default router; 