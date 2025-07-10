import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { handleServiceResponse, sendInternalErrorResponse } from '../utils/responseUtils';

const router = Router();
const authService = new AuthService();

router.post('/register-user', async (req: Request, res: Response) => {
    try {
        const result = await authService.registerUser(req.body);
        handleServiceResponse(res, result, 201);
    } catch (error) {
        console.error('Registration error:', error);
        sendInternalErrorResponse(res, 'Failed to register user');
    }
});

router.post('/login-user', async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);
        handleServiceResponse(res, result);
    } catch (error) {
        console.error('Login error:', error);
        sendInternalErrorResponse(res, 'Failed to login');
    }
});

export default router; 