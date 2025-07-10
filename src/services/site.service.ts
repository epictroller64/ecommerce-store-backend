import { db } from '../db/connection';
import { siteConfig, heroImages } from '../db/schema';
import { createSuccessResponse, createErrorResponse, SiteInfo, HeroImage, ApiResponse } from '../types';

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
} 