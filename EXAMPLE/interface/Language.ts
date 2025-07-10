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

export interface Translation {
    [key: string]: string | Translation;
}

export interface LocalizedContent {
    [languageCode: string]: Translation;
}

export interface LanguageConfig {
    defaultLanguage: string;
    supportedLanguages: Language[];
    fallbackLanguage: string;
    autoDetect: boolean;
    persistLanguage: boolean;
}

export interface LocalizedSiteConfig {
    [languageCode: string]: {
        siteInfo: {
            name: string;
            description: string;
        };
        content: {
            hero: {
                title: string;
                subtitle: string;
            };
            featured: {
                title: string;
                subtitle: string;
            };
            categories: {
                title: string;
                subtitle: string;
            };
        };
        navigation: {
            mainMenu: Array<{
                id: string;
                label: string;
                url: string;
            }>;
            footerLinks: Array<{
                id: string;
                label: string;
                url: string;
            }>;
        };
    };
}

export interface LanguageContextType {
    currentLanguage: string;
    setLanguage: (languageCode: string) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    isRTL: boolean;
    formatDate: (date: Date) => string;
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
    formatCurrency: (amount: number, currency?: string) => string;
} 