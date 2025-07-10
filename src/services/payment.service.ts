import { db } from '../db/connection';
import { paymentMethods } from '../db/schema';
import { createSuccessResponse, createErrorResponse, PaymentMethodFrontend, ApiResponse } from '../types';

export class PaymentService {
    async getAllPaymentMethods(): Promise<ApiResponse<PaymentMethodFrontend[]>> {
        try {
            const methods = await db.select().from(paymentMethods);
            const frontendMethods: PaymentMethodFrontend[] = methods.map(method => ({
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
} 