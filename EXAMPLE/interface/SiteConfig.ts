import { ThemeConfig } from '../Style';
import { LanguageConfig } from './Language';


export interface HeroConfig {
    titleTranslationKey: string;
    subtitleTranslationKey: string;
    images: string[];
    autoPlay: boolean;
    autoPlayInterval: number;
}


export interface SiteConfig {
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
        paymentMethods: PaymentMethod[];
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

// Supporting interfaces
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

export interface PaymentMethod {
    id: string;
    nameTranslationKey: string;
    icon: string;
    enabled: boolean;
    processingFee?: number;
}

// Configuration update interface
export interface ConfigUpdate {
    path: string;
    value: unknown;
    timestamp: Date;
    userId?: string;
}

// Configuration response interface
export interface ConfigResponse {
    success: boolean;
    data?: SiteConfig;
    error?: string;
    lastUpdated: Date;
    version: string;
} 