import { config } from '../configuration';
import { db } from '../db/connection';
import { Request, Response } from 'express';
import { paymentMethods } from '../db/schema';
import { createSuccessResponse, createErrorResponse, PaymentMethodFrontend, ApiResponse, ConfigurationPaymentProvider, WebhookConfig } from '../types';

export class PaymentService {
    constructor(private paymentProviders: ConfigurationPaymentProvider[], private webhookHandlers: WebhookConfig[]) {

    }
    async getAllPaymentMethods(): Promise<ApiResponse<PaymentMethodFrontend[]>> {
        try {
            const methods = await db.select().from(paymentMethods);
            const filteredMethods = methods.filter(method => this.paymentProviders.some(provider => provider.id === method.id && method.isAvailable)); // filter out missing payment providers
            const frontendMethods: PaymentMethodFrontend[] = filteredMethods.map(method => ({
                id: method.id,
                name: method.name,
                description: method.description || '',
                icon: method.icon || '',
                type: method.type as any,
                isAvailable: method.isAvailable || false,
                processingFee: method.processingFee ? Number(method.processingFee) : undefined,
                processingTime: method.processingTime || undefined,
            }));
            return createSuccessResponse(frontendMethods, 'Payment methods retrieved successfully');
        } catch (error) {
            console.error('Get payment methods error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch payment methods');
        }
    }

    async createPayment(orderId: string, paymentMethodId: string): Promise<ApiResponse<string>> {
        const paymentProvider = this.paymentProviders.find(provider => provider.id === paymentMethodId);
        if (!paymentProvider) {
            return createErrorResponse('INVALID_PAYMENT_METHOD', 'Invalid payment method');
        }
        await paymentProvider.provider.createPayment(orderId);
        return createSuccessResponse(orderId, 'Payment created successfully');
    }

    async cancelPayment(orderId: string, paymentMethodId: string): Promise<ApiResponse<string>> {
        const paymentProvider = this.paymentProviders.find(provider => provider.id === paymentMethodId);
        if (!paymentProvider) {
            return createErrorResponse('INVALID_PAYMENT_METHOD', 'Invalid payment method');
        }
        await paymentProvider.provider.cancelPayment(orderId);
        return createSuccessResponse(orderId, 'Payment cancelled successfully');
    }

    async getPaymentStatus(orderId: string, paymentMethodId: string): Promise<ApiResponse<string>> {
        const paymentProvider = this.paymentProviders.find(provider => provider.id === paymentMethodId);
        if (!paymentProvider) {
            return createErrorResponse('INVALID_PAYMENT_METHOD', 'Invalid payment method');
        }
        const status = await paymentProvider.provider.getPaymentStatus(orderId);
        return createSuccessResponse(status, 'Payment status retrieved successfully');
    }

    async handleWebhook(req: Request, res: Response, paymentProviderId: string): Promise<ApiResponse<string>> {
        const paymentProvider = this.paymentProviders.find(provider => provider.id === paymentProviderId);
        if (!paymentProvider) {
            return createErrorResponse('INVALID_PAYMENT_METHOD', 'Invalid payment method');
        }
        // relay that to the specific provider
        await paymentProvider.provider.handleWebhook(req, res);

        return createSuccessResponse(paymentProviderId, 'Webhook handled successfully');
    }
} 