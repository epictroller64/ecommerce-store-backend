import { Router, Request, Response } from 'express';
import { DeliveryService } from '../services/delivery.service';
import { handleServiceResponse, sendInternalErrorResponse } from '../utils/responseUtils';

const router = Router();
const deliveryService = new DeliveryService();

router.get('/get-delivery-methods', async (req: Request, res: Response) => {
    try {
        const result = await deliveryService.getAllDeliveryMethods();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get delivery methods error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch delivery methods');
    }
});

export default router; 