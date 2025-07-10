import { Variant } from "./Products";

export interface OrderItem {
    id: string;
    variant: Variant;
    quantity: number;
    price: number;
}


export interface Order {
    id: string;
    userId: string;
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    createdAt: Date;
    updatedAt: Date;
    deliveryMethodId: string;
    paymentMethodId: string;
    items: OrderItem[]
}