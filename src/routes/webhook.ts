import { Router, Request, Response } from "express";
import { config } from "../configuration";
import { paymentService } from "../services";


// Webhook routes
export const router = Router();

config.webhookHandlers.forEach(handler => {
    router.post(handler.path, handler.handler);
});

////webhook/stripe
//router.post('/stripe', async (req: Request, res: Response) => {
//console.log('stripe webhook received');
//const paymentProviderId = "stripe"
//await paymentService.handleWebhook(req, res, paymentProviderId)
//// stripe waits for 200 response
//});
