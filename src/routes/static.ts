import { Router, Request, Response } from 'express';
import { StaticService } from '../services/static.service';
import path from 'path';
import fs from 'fs';

const router = Router();
const staticService = new StaticService();

router.get('/', async (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Static routes',
    });
});

// Handle nested paths like /static/images/filename.jpg
router.get('/*', async (req: Request, res: Response) => {
    try {
        const filePath = req.params[0]; // This captures everything after /static/
        const fullPath = await staticService.getFilePath(filePath);

        console.log(`Static file request: ${filePath} -> ${fullPath}`);

        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            console.log(`File not found: ${fullPath}`);
            return res.status(404).json({
                success: false,
                message: 'File not found',
                path: filePath,
                fullPath: fullPath
            });
        }

        // Get file extension to set proper content type
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = staticService.getContentType(ext);

        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        res.sendFile(fullPath);
    } catch (error) {
        console.error('Static file error:', error);
        res.status(500).json({
            success: false,
            message: 'Error serving static file'
        });
    }
});

export default router;