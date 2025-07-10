import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';
import { handleServiceResponse, sendAuthErrorResponse, sendInternalErrorResponse } from '../utils/responseUtils';

const router = Router();
const userService = new UserService();

// Get user info
router.get('/get-user', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendAuthErrorResponse(res);
        }

        const result = await userService.getUserForFrontend(req.user.id);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Get user error:', error);
        sendInternalErrorResponse(res, 'Failed to fetch user');
    }
});

// Update user settings
router.post('/update-user-settings', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return sendAuthErrorResponse(res);
        }

        const result = await userService.updateUserSettings(req.user.id, req.body);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Update user settings error:', error);
        sendInternalErrorResponse(res, 'Failed to update user settings');
    }
});

export default router; 