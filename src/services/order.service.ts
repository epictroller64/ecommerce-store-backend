import { db } from '../db/connection';
import { orders, orderItems, productVariants } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import {
    createSuccessResponse,
    createErrorResponse,
    CreateOrderRequest,
    CompleteCheckoutRequest,
    OrderFrontend,
    OrderItemFrontend,
    CompleteCheckoutResponse,
    ApiResponse,
    Variant
} from '../types';

export class OrderService {
    async createOrder(userId: string, orderData: CreateOrderRequest): Promise<ApiResponse<OrderFrontend>> {
        try {
            if (!orderData.items || orderData.items.length === 0) {
                return createErrorResponse('VALIDATION_ERROR', 'Order must contain at least one item');
            }

            // Calculate total price and validate variants
            let totalPrice = 0;
            const orderItemsData = [];

            for (const item of orderData.items) {
                const variant = await db
                    .select()
                    .from(productVariants)
                    .where(eq(productVariants.id, item.variantId))
                    .limit(1);

                if (!variant.length) {
                    return createErrorResponse('INVALID_VARIANT', `Variant ${item.variantId} not found`);
                }

                if (variant[0].stock < item.quantity) {
                    return createErrorResponse('INSUFFICIENT_STOCK', `Insufficient stock for variant ${item.variantId}`);
                }

                const itemPrice = Number(variant[0].price) * item.quantity;
                totalPrice += itemPrice;

                orderItemsData.push({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: itemPrice,
                });
            }

            // Create order
            const newOrder = await db
                .insert(orders)
                .values({
                    userId,
                    totalPrice: totalPrice.toString(),
                    deliveryMethodId: orderData.deliveryMethodId,
                    paymentMethodId: orderData.paymentMethodId,
                    shippingAddress: orderData.shippingAddress,
                })
                .returning();

            // Create order items
            await Promise.all(
                orderItemsData.map(async (item) => {
                    await db
                        .insert(orderItems)
                        .values({
                            orderId: newOrder[0].id,
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price.toString(),
                        });
                })
            );

            // Update stock using raw SQL to avoid type issues
            for (const item of orderData.items) {
                await db.execute(sql`
                    UPDATE product_variants 
                    SET stock = stock - ${item.quantity}
                    WHERE id = ${item.variantId}
                `);
            }

            // Get order with items for response
            const orderWithItems = await this.getOrderWithItems(newOrder[0].id);

            return createSuccessResponse(orderWithItems, 'Order created successfully');
        } catch (error) {
            console.error('Create order error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to create order');
        }
    }

    async getOrdersForUser(userId: string): Promise<ApiResponse<OrderFrontend[]>> {
        try {
            const userOrders = await db
                .select()
                .from(orders)
                .where(eq(orders.userId, userId))
                .orderBy(desc(orders.createdAt));

            const ordersWithItems: OrderFrontend[] = await Promise.all(
                userOrders.map(async (order) => {
                    return await this.getOrderWithItems(order.id);
                })
            );

            return createSuccessResponse(ordersWithItems, 'Orders retrieved successfully');
        } catch (error) {
            console.error('Get orders error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch orders');
        }
    }

    async getOrderById(userId: string, orderId: string): Promise<ApiResponse<OrderFrontend>> {
        try {
            const order = await db
                .select()
                .from(orders)
                .where(eq(orders.id, orderId))
                .limit(1);

            if (!order.length) {
                return createErrorResponse('ORDER_NOT_FOUND', 'Order not found');
            }

            if (order[0].userId !== userId) {
                return createErrorResponse('FORBIDDEN', 'Access denied');
            }

            const orderWithItems = await this.getOrderWithItems(order[0].id);

            return createSuccessResponse(orderWithItems, 'Order retrieved successfully');
        } catch (error) {
            console.error('Get order error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch order');
        }
    }

    private async getOrderWithItems(orderId: string): Promise<OrderFrontend> {
        const order = await db
            .select()
            .from(orders)
            .where(eq(orders.id, orderId))
            .limit(1);

        const items = await db
            .select()
            .from(orderItems)
            .where(eq(orderItems.orderId, orderId));

        const orderItemsFrontend: OrderItemFrontend[] = await Promise.all(
            items.map(async (item) => {
                const variant = await db
                    .select()
                    .from(productVariants)
                    .where(eq(productVariants.id, item.variantId))
                    .limit(1);

                const variantFrontend: Variant = {
                    id: variant[0].id,
                    key: variant[0].key,
                    label: variant[0].label,
                    translationKey: variant[0].translationKey,
                    productId: variant[0].productId,
                    name: variant[0].name,
                    price: Number(variant[0].price),
                    currency: variant[0].currency,
                    images: variant[0].images || [],
                };

                return {
                    id: item.id,
                    variant: variantFrontend,
                    quantity: item.quantity,
                    price: Number(item.price),
                };
            })
        );

        return {
            id: order[0].id,
            userId: order[0].userId,
            totalPrice: Number(order[0].totalPrice),
            status: order[0].status as any,
            createdAt: order[0].createdAt,
            updatedAt: order[0].updatedAt,
            deliveryMethodId: order[0].deliveryMethodId || '',
            paymentMethodId: order[0].paymentMethodId || '',
            items: orderItemsFrontend,
        };
    }
} 