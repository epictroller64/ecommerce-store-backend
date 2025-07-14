import { db } from '../db/connection';
import { siteConfig, heroImages, paymentMethods, deliveryMethods } from '../db/schema';
import {
    createSuccessResponse,
    createErrorResponse,
    SiteInfo,
    HeroImage,
    ApiResponse,
    SiteConfig,
    FrontendSiteConfig,
    ThemeConfig,
    LanguageConfig,
    HeroConfig,
    MenuItem,
    FooterLink,
    SocialLink,
    ShippingMethod,
    PaymentMethodConfig
} from '../types';

export class SiteService {
    async getSiteInfo(): Promise<ApiResponse<SiteInfo>> {
        try {
            const config = await db.select().from(siteConfig);
            // Simplified: just return all config as an array
            return createSuccessResponse({
                name: 'Ecommerce Store',
                description: 'A modern ecommerce platform',
                logoSrc: '',
                version: '1.0.0',
                features: [],
            }, 'Site info retrieved successfully');
        } catch (error) {
            console.error('Get site info error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch site info');
        }
    }

    async getHeroImages(): Promise<ApiResponse<HeroImage[]>> {
        try {
            const images = await db.select().from(heroImages);
            return createSuccessResponse(images, 'Hero images retrieved successfully');
        } catch (error) {
            console.error('Get hero images error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch hero images');
        }
    }

    async getSiteConfig(): Promise<ApiResponse<FrontendSiteConfig>> {
        try {
            // Get all configuration data from database
            const configData = await db.select().from(siteConfig);
            const paymentMethodsData = await db.select().from(paymentMethods);
            const deliveryMethodsData = await db.select().from(deliveryMethods);
            const heroImagesData = await db.select().from(heroImages);

            // Transform database data into frontend format
            const frontendSiteConfig: FrontendSiteConfig = {
                siteInfo: {
                    name: 'Ecommerce Store',
                    descriptionTranslationKey: 'site.description',
                    logo: '/logo.png',
                    favicon: '/favicon.ico',
                    domain: 'localhost:3000'
                },
                theme: {
                    primaryColor: '#3B82F6',
                    secondaryColor: '#1F2937',
                    backgroundColor: '#FFFFFF',
                    textColor: '#111827',
                    accentColor: '#F59E0B',
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: {
                        small: '14px',
                        medium: '16px',
                        large: '18px',
                        xlarge: '24px'
                    }
                },
                content: {
                    hero: {
                        titleTranslationKey: 'hero.title',
                        subtitleTranslationKey: 'hero.subtitle',
                        images: heroImagesData.map(img => img.imageUrl),
                        autoPlay: true,
                        autoPlayInterval: 5000
                    },
                    featured: {
                        enabled: true,
                        titleTranslationKey: 'featured.title',
                        subtitleTranslationKey: 'featured.subtitle',
                        productIds: []
                    },
                    categories: {
                        enabled: true,
                        titleTranslationKey: 'categories.title',
                        subtitleTranslationKey: 'categories.subtitle',
                        featuredCategories: []
                    }
                },
                navigation: {
                    mainMenu: [
                        {
                            id: 'home',
                            label: 'Home',
                            url: '/',
                            translationKey: 'nav.home',
                            icon: 'home'
                        },
                        {
                            id: 'products',
                            label: 'Products',
                            url: '/products',
                            translationKey: 'nav.products',
                            icon: 'shopping-bag'
                        },
                        {
                            id: 'categories',
                            label: 'Categories',
                            url: '/categories',
                            translationKey: 'nav.categories',
                            icon: 'grid'
                        }
                    ],
                    footerLinks: [
                        {
                            id: 'about',
                            label: 'About',
                            url: '/about',
                            translationKey: 'footer.about'
                        },
                        {
                            id: 'contact',
                            label: 'Contact',
                            url: '/contact',
                            translationKey: 'footer.contact'
                        },
                        {
                            id: 'privacy',
                            label: 'Privacy Policy',
                            url: '/privacy',
                            translationKey: 'footer.privacy'
                        }
                    ],
                    socialLinks: [
                        {
                            id: 'facebook',
                            platform: 'facebook',
                            url: 'https://facebook.com',
                            icon: 'facebook'
                        },
                        {
                            id: 'twitter',
                            platform: 'twitter',
                            url: 'https://twitter.com',
                            icon: 'twitter'
                        },
                        {
                            id: 'instagram',
                            platform: 'instagram',
                            url: 'https://instagram.com',
                            icon: 'instagram'
                        }
                    ]
                },
                ecommerce: {
                    currency: 'USD',
                    currencySymbol: '$',
                    taxRate: 0.08,
                    shippingMethods: deliveryMethodsData.map(method => ({
                        id: method.id,
                        nameTranslationKey: `shipping.${method.name.toLowerCase()}`,
                        price: Number(method.price),
                        estimatedDaysTranslationKey: `shipping.${method.estimatedDays}`,
                        enabled: method.isAvailable ?? true
                    })),
                    paymentMethods: paymentMethodsData.map(method => ({
                        id: method.id,
                        nameTranslationKey: `payment.${method.name.toLowerCase()}`,
                        icon: method.icon || 'credit-card',
                        enabled: method.isAvailable ?? true,
                        processingFee: method.processingFee ? Number(method.processingFee) : undefined
                    })),
                    inventoryManagement: true,
                    stockThreshold: 10
                },
                seo: {
                    titleTranslationKey: 'seo.title',
                    descriptionTranslationKey: 'seo.description',
                    keywords: ['ecommerce', 'online store', 'shopping'],
                    ogImage: '/og-image.jpg',
                    canonicalUrl: 'https://localhost:3000'
                },
                analytics: {
                    googleAnalyticsId: undefined,
                    facebookPixelId: undefined,
                    hotjarId: undefined
                },
                features: {
                    reviews: true,
                    wishlist: true,
                    compare: true,
                    quickView: true,
                    liveChat: false,
                    newsletter: true
                },
                api: {
                    baseUrl: 'http://localhost:3001',
                    timeout: 5000,
                    retryAttempts: 3,
                    cacheTimeout: 300000
                },
                language: {
                    defaultLanguage: 'en',
                    supportedLanguages: [
                        {
                            code: 'en',
                            name: 'English',
                            nativeName: 'English',
                            flag: '🇺🇸',
                            rtl: false,
                            dateFormat: 'MM/DD/YYYY',
                            numberFormat: {
                                decimal: '.',
                                thousands: ',',
                                currency: '$'
                            }
                        },
                        {
                            code: 'es',
                            name: 'Spanish',
                            nativeName: 'Español',
                            flag: '🇪🇸',
                            rtl: false,
                            dateFormat: 'DD/MM/YYYY',
                            numberFormat: {
                                decimal: ',',
                                thousands: '.',
                                currency: '€'
                            }
                        }
                    ],
                    fallbackLanguage: 'en',
                    autoDetect: true,
                    persistLanguage: true
                }
            };

            return createSuccessResponse(frontendSiteConfig, 'Site config retrieved successfully');
        } catch (error) {
            console.error('Get site config error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch site config');
        }
    }
} 