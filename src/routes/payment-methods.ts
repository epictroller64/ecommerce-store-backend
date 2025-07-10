import { Router, Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { handleServiceResponse, sendInternalErrorResponse } from '../utils/responseUtils';

const router = Router();
const paymentService = new PaymentService();

router.get('/get-payment-methods', async (req: Request, res: Response) => {
    try {
        const result = await paymentService.getAllPaymentMethods();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get payment methods error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch payment methods');
    }
});

export default router; 