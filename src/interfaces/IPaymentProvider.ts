import { Request, Response } from "express";
export interface IPaymentProvider {
    createPayment(orderId: string): Promise<CreatePaymentResponse>
    cancelPayment(orderId: string): Promise<void>
    confirmPayment(orderId: string): Promise<void> // when payment is confirmed
    getPaymentStatus(orderId: string): Promise<string>
    handleWebhook(req: Request, res: Response): Promise<void>
    providerId: string
}

export type CreatePaymentResponse = {
    paymentUrl: string
    shouldRedirect: boolean
}