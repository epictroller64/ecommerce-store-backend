export interface DeliveryMethod {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: 'standard' | 'express' | 'same_day' | 'pickup';
    price: number;
    currency: string;
    estimatedDays: string;
    isAvailable: boolean;
    trackingAvailable: boolean;
}

export interface DeliveryMethodResponse {
    deliveryMethods: DeliveryMethod[];
} 