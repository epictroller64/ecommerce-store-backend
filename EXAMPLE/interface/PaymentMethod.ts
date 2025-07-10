export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: 'card' | 'digital_wallet' | 'bank_transfer' | 'crypto';
    isAvailable: boolean;
    processingFee?: number;
    processingTime?: string;
}

export interface PaymentMethodResponse {
    paymentMethods: PaymentMethod[];
} 