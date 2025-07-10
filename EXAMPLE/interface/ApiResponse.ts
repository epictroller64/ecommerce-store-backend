import { ProductFilters, ProductWithPrice } from "./Products";
import { Category } from "./Category";

export interface ApiResponse<T = unknown> {
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
    cacheAge?: number; // in seconds
    expiresAt?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: UserInfo;
    expiresAt: string;
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

export interface ProductsResponse {
    products: ProductWithPrice[];
    categories?: Category[];
    filters?: ProductFilters;
}


export interface SiteInfoResponse {
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

export type SuccessResponse<T> = ApiResponse<T> & {
    success: true;
    data: T;
};

export type ErrorResponse = ApiResponse<never> & {
    success: false;
    error: ApiError;
};

export const createSuccessResponse = <T>(data: T, message = "Success"): SuccessResponse<T> => ({
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
): ErrorResponse => ({
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
): SuccessResponse<T[]> => ({
    success: true,
    message,
    data,
    meta: {
        timestamp: new Date().toISOString(),
        pagination,
    },
});


export interface CompleteCheckoutResponse {
    orderId: string;
    totalPrice: number;
    deliveryMethodId: string;
    paymentMethodId: string;
}