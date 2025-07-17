import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { Request, Response } from 'express';
import {
    users,
    products,
    categories,
    orders,
    orderItems,
    productVariants,
    paymentMethods,
    deliveryMethods,
    siteConfig,
    heroImages,
    productRatings
} from '../db/schema';
import { IPaymentProvider } from '../interfaces/IPaymentProvider';

// types for db
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type ProductRating = InferSelectModel<typeof productRatings>;
export type NewProductRating = InferInsertModel<typeof productRatings>;

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export type ProductVariant = InferSelectModel<typeof productVariants>;
export type NewProductVariant = InferInsertModel<typeof productVariants>;

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

export type OrderItem = InferSelectModel<typeof orderItems>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;

export type PaymentMethod = InferSelectModel<typeof paymentMethods>;
export type NewPaymentMethod = InferInsertModel<typeof paymentMethods>;

export type DeliveryMethod = InferSelectModel<typeof deliveryMethods>;
export type NewDeliveryMethod = InferInsertModel<typeof deliveryMethods>;

export type SiteConfig = InferSelectModel<typeof siteConfig>;
export type NewSiteConfig = InferInsertModel<typeof siteConfig>;

export type HeroImage = InferSelectModel<typeof heroImages>;
export type NewHeroImage = InferInsertModel<typeof heroImages>;

// Frontend interface types (matching EXAMPLE/interface)
export interface ProductWithPrice extends Product {
    price: number;
    currency: string;
    inStock: boolean;
    images: string[];
}

export interface ProductWithVariants extends Product {
    variants: Variant[];
}

export interface Variant {
    id: string;
    key: string;
    label: string;
    translationKey: string;
    productId: string;
    name: string;
    price: number;
    currency: string;
    images: string[];
}

export interface ProductFilters {
    priceRange?: {
        min: number;
        max: number;
    };
    categories?: string[];
    inStock?: boolean;
    rating?: number;
    searchQuery?: string;
}

export interface OrderItemFrontend {
    id: string;
    variant: Variant;
    quantity: number;
    price: number;
}

export interface OrderFrontend {
    id: string;
    userId: string;
    totalPrice: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
    createdAt: Date;
    updatedAt: Date;
    deliveryMethodId: string;
    paymentMethodId: string;
    items: OrderItemFrontend[];
}

export interface PaymentMethodFrontend {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: 'card' | 'digital_wallet' | 'bank_transfer' | 'crypto';
    isAvailable: boolean;
    processingFee?: number;
    processingTime?: string;
}

export interface DeliveryMethodFrontend {
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

export interface CategoryFrontend {
    id: string;
    name: string;
    description?: string;
    productCount: number;
}

export interface UserFrontend {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserInfo {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    createdAt: string;
    lastLoginAt?: string;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: UserInfo;
    expiresAt: string;
}

export interface SiteInfo {
    name: string;
    description: string;
    logoSrc: string;
    version: string;
    features: string[];
    contactInfo?: ContactInfo;
}


export interface ContactInfo {
    email?: string;
    phone?: string;
    address?: string;
    socialMedia?: Record<string, string>;
}

export interface ProductsResponse {
    products: ProductWithPrice[];
    categories?: CategoryFrontend[];
    filters?: ProductFilters;
}

export interface CompleteCheckoutResponse {
    orderId: string;
    totalPrice: number;
    deliveryMethodId: string;
    paymentMethodId: string;
}

export interface PaymentMethodResponse {
    paymentMethods: PaymentMethodFrontend[];
}

export interface DeliveryMethodResponse {
    deliveryMethods: DeliveryMethodFrontend[];
}

// api response types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
}

export interface ResponseMeta {
    timestamp: string;
    requestId?: string;
    pagination?: PaginationMeta;
    cache?: CacheMeta;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface CacheMeta {
    cached: boolean;
    cacheAge?: number;
    expiresAt?: string;
}

// Request types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface CreateOrderRequest {
    items: Array<{
        variantId: string;
        quantity: number;
    }>;
    deliveryMethodId: string;
    paymentMethodId: string;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export interface CompleteCheckoutRequest {
    orderId: string;
    paymentDetails: Record<string, any>;
}

export interface UpdateUserSettingsRequest {
    name?: string;
    email?: string;
}

export interface GetProductsRequest {
    pagination: {
        max: number;
        pageNum: number;
    };
}

// helper functions for API responses
export const createSuccessResponse = <T>(data: T, message = "Success"): ApiResponse<T> => ({
    success: true,
    message,
    data,
    meta: {
        timestamp: new Date().toISOString(),
    },
});

export const createErrorResponse = (
    code: string,
    message: string,
    details?: Record<string, unknown>
): ApiResponse<never> => ({
    success: false,
    message,
    error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
    },
    meta: {
        timestamp: new Date().toISOString(),
    },
});

export const createPaginatedResponse = <T>(
    data: T[],
    pagination: PaginationMeta,
    message = "Success"
): ApiResponse<T[]> => ({
    success: true,
    message,
    data,
    meta: {
        timestamp: new Date().toISOString(),
        pagination,
    },
});

export interface LanguageConfig {
    defaultLanguage: string;
    supportedLanguages: Language[];
    fallbackLanguage: string;
    autoDetect: boolean;
    persistLanguage: boolean;
}

export interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag?: string;
    rtl?: boolean;
    dateFormat: string;
    numberFormat: {
        decimal: string;
        thousands: string;
        currency: string;
    };
}

export interface ThemeConfig {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    borderRadius: string;
    fontFamily: string;
    fontSize: {
        small: string;
        medium: string;
        large: string;
        xlarge: string;
    };
}

export interface HeroConfig {
    titleTranslationKey: string;
    subtitleTranslationKey: string;
    images: string[];
    autoPlay: boolean;
    autoPlayInterval: number;
}

export interface MenuItem {
    id: string;
    label: string;
    url: string;
    children?: MenuItem[];
    icon?: string;
    external?: boolean;
    translationKey: string;
}

export interface FooterLink {
    id: string;
    label: string;
    url: string;
    external?: boolean;
    translationKey: string;
}

export interface SocialLink {
    id: string;
    platform: string;
    url: string;
    icon: string;
}

export interface ShippingMethod {
    id: string;
    nameTranslationKey: string;
    price: number;
    estimatedDaysTranslationKey: string;
    enabled: boolean;
}

export interface PaymentMethodConfig {
    id: string;
    nameTranslationKey: string;
    icon: string;
    enabled: boolean;
    processingFee?: number;
}

// Frontend SiteConfig interface matching the EXAMPLE structure
export interface FrontendSiteConfig {
    // Basic site info
    siteInfo: {
        name: string;
        descriptionTranslationKey: string;
        logo: string;
        favicon: string;
        domain: string;
    };

    // Theme configuration
    theme: ThemeConfig;

    // Content configuration
    content: {
        hero: HeroConfig;
        featured: {
            enabled: boolean;
            titleTranslationKey: string;
            subtitleTranslationKey: string;
            productIds: string[];
        };
        categories: {
            enabled: boolean;
            titleTranslationKey: string;
            subtitleTranslationKey: string;
            featuredCategories: string[];
        };
    };

    // Navigation configuration
    navigation: {
        mainMenu: MenuItem[];
        footerLinks: FooterLink[];
        socialLinks: SocialLink[];
    };

    // E-commerce settings
    ecommerce: {
        currency: string;
        currencySymbol: string;
        taxRate: number;
        shippingMethods: ShippingMethod[];
        paymentMethods: PaymentMethodConfig[];
        inventoryManagement: boolean;
        stockThreshold: number;
    };

    // SEO configuration
    seo: {
        titleTranslationKey: string;
        descriptionTranslationKey: string;
        keywords: string[];
        ogImage: string;
        canonicalUrl: string;
    };

    // Analytics and tracking
    analytics: {
        googleAnalyticsId?: string;
        facebookPixelId?: string;
        hotjarId?: string;
    };

    // Feature flags
    features: {
        reviews: boolean;
        wishlist: boolean;
        compare: boolean;
        quickView: boolean;
        liveChat: boolean;
        newsletter: boolean;
    };

    // API configuration
    api: {
        baseUrl: string;
        timeout: number;
        retryAttempts: number;
        cacheTimeout: number;
    };

    // Language configuration
    language: LanguageConfig;
}

export interface FraudValidationJob {
    orderId: string;
}



export interface EmailTemplate {
    id: string
    subject: string
    body: string
    template: string
    variables: Record<string, string>
}
export interface ConfigurationPaymentProvider {
    id: string
    provider: IPaymentProvider
    webhookPath: string
}


export type WebhookConfig = {
    id: string;
    path: string;
    handler: (req: Request, res: Response) => Promise<void>;
}
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'paid';