import { db } from '../db/connection';
import { deliveryMethods } from '../db/schema';
import { createSuccessResponse, createErrorResponse, DeliveryMethodFrontend, ApiResponse } from '../types';

export class DeliveryService {
    // get all delivery methods
    async getAllDeliveryMethods(): Promise<ApiResponse<DeliveryMethodFrontend[]>> {
        try {
            const methods = await db.select().from(deliveryMethods);
            const frontendMethods: DeliveryMethodFrontend[] = methods.map(method => ({
                id: method.id,
                name: method.name,
                description: method.description || '',
                icon: method.icon || '',
                type: method.type as any,
                price: Number(method.price),
                currency: method.currency,
                estimatedDays: method.estimatedDays,
                isAvailable: method.isAvailable || false,
                trackingAvailable: method.trackingAvailable || false,
            }));
            return createSuccessResponse(frontendMethods, 'Delivery methods retrieved successfully');
        } catch (error) {
            console.error('Get delivery methods error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch delivery methods');
        }
    }
} 