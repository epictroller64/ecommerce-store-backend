import { Router, Request, Response } from 'express';
import { SiteService } from '../services/site.service';
import { handleServiceResponse, sendInternalErrorResponse } from '../utils/responseUtils';

const router = Router();
const siteService = new SiteService();

router.get('/get-site-info', async (req: Request, res: Response) => {
    try {
        const result = await siteService.getSiteInfo();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get site info error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch site info');
    }
});

router.get('/get-hero-images', async (req: Request, res: Response) => {
    try {
        const result = await siteService.getHeroImages();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get hero images error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch hero images');
    }
});

router.get('/get-config', async (req: Request, res: Response) => {
    try {
        const result = await siteService.getSiteConfig();
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get config error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch config');
    }
});

export default router; 