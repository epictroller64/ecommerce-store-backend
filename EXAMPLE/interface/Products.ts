
// Using this to fetch required info for the productcollections
export interface ProductWithPrice extends Product {
    price: number;
    currency: string;
    inStock: boolean;
    images: string[]; // 2 Images for the product as we dont need more for the main page, handled by backend
}

export interface ProductWithVariants extends Product {
    variants: Variant[];
}

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    rating?: number;
    reviewCount?: number;
    createdAt: string;
    updatedAt: string;
    sharedImages: boolean; // Whether the images are shared with own variants
}

export interface Variant {
    id: string;
    key: string; // color, size, etc
    label: string; // Red, Small, etc
    translationKey: string; // red, small, etc
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
}