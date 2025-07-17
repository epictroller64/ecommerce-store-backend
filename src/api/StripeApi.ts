import Stripe from "stripe";
import { CreatePaymentResponse, IPaymentProvider } from "../interfaces/IPaymentProvider";
import { Request, Response } from "express";
import { orderService } from "../services";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export class StripeApi implements IPaymentProvider {
    async createPayment(orderId: string): Promise<CreatePaymentResponse> {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: 'price_1QZ999999999999999999999',
                quantity: 1,
            }],
            mode: 'payment',
            metadata: {
                orderId: orderId
            },
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });
        if (!session.url) {
            throw new Error("Failed to create payment session");
        }
        return {
            paymentUrl: session.url || '',
            shouldRedirect: true
        };
    }
    cancelPayment(orderId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    confirmPayment(orderId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getPaymentStatus(orderId: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    providerId: string = 'stripe';
    endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET || '';
    async handleWebhook(req: Request, res: Response): Promise<void> {
        const event = req.body;
        if (this.endpointSecret) {
            // Get the signature sent by Stripe
            const signature = req.headers['stripe-signature'];
            if (!signature) {
                res.sendStatus(400);
                return;
            }
            try {
                const event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    this.endpointSecret
                );
                switch (event.type) {
                    case 'payment_intent.succeeded':
                        const paymentIntent = event.data.object;
                        const orderId = paymentIntent.metadata.orderId;
                        if (!orderId) {
                            console.log("No orderId found in payment intent");
                            res.sendStatus(400);
                            return;
                        }
                        await orderService.markOrderStatus(orderId, 'paid');
                        // Payment success, mark it paid
                        break;
                    case 'payment_method.attached':
                        const paymentMethod = event.data.object;
                        break;
                    default:
                        console.log(`Unhandled event type ${event.type}`);
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.log(`⚠️  Webhook signature verification failed.`, err.message);
                }
                res.sendStatus(400);
                return;
            }
        }
        res.json({ received: true });
    }
}