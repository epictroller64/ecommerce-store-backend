import { eq, sql } from "drizzle-orm";
import db from "../db/connection";
import { deliveryMethods, orderItems, orders, paymentMethods } from "../db/schema";
import { ApiResponse, CompleteCheckoutResponse, createErrorResponse, createSuccessResponse } from "../types";

export class CheckoutService {
    async completeCheckout(orderId: string, paymentMethodId: string, deliveryMethodId: string): Promise<ApiResponse<CompleteCheckoutResponse>> {
        try {
            const order = await db.select().from(orders).where(eq(orders.id, orderId));
            if (!order) {
                return createErrorResponse('ORDER_NOT_FOUND', 'Order not found');
            }
            const paymentMethod = await db.select().from(paymentMethods).where(eq(paymentMethods.id, paymentMethodId));
            if (!paymentMethod) {
                return createErrorResponse('PAYMENT_METHOD_NOT_FOUND', 'Payment method not found');
            }
            const deliveryMethod = await db.select().from(deliveryMethods).where(eq(deliveryMethods.id, deliveryMethodId));
            if (!deliveryMethod) {
                return createErrorResponse('DELIVERY_METHOD_NOT_FOUND', 'Delivery method not found');
            }
            const _orderItems = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
            if (!_orderItems) {
                return createErrorResponse('ORDER_ITEMS_NOT_FOUND', 'Order items not found');
            }
            const totalPrice = _orderItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
            const updatedOrder = await db.update(orders).set({
                status: 'completed',
                totalPrice: sql`${totalPrice}`,
                deliveryMethodId: deliveryMethodId,
                paymentMethodId: paymentMethodId,
            }).where(eq(orders.id, orderId));
            return createSuccessResponse({
                orderId: orderId,
                totalPrice: totalPrice,
                deliveryMethodId: deliveryMethodId,
                paymentMethodId: paymentMethodId,
            }, 'Order completed successfully');
        } catch (error) {
            console.error('Error completing checkout:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to complete checkout');
        }
    }
}