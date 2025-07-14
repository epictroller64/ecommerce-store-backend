import { Router, Request, Response } from 'express';
import { handleServiceResponse, sendInternalErrorResponse, sendValidationErrorResponse } from "../utils/responseUtils";
import { CheckoutService } from "../services/checkout.service";

const router = Router();
const checkoutService = new CheckoutService();
router.post('/complete-checkout', async (req: Request, res: Response) => {
    try {
        const { orderId, paymentMethodId, deliveryMethodId } = req.body;
        if (!orderId || !paymentMethodId || !deliveryMethodId) {
            return sendValidationErrorResponse(res, 'Order ID, payment method ID, and delivery method ID are required');
        }
        const result = await checkoutService.completeCheckout(req.body.orderId, req.body.paymentMethodId, req.body.deliveryMethodId);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Error completing checkout:', error);
        sendInternalErrorResponse(res, 'Failed to complete checkout');
    }
});

export default router;