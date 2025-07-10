import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createErrorResponse } from '../types';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name?: string;
        role: string;
    };
}

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json(
                createErrorResponse('UNAUTHORIZED', 'Access token required')
            );
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }

        const decoded = jwt.verify(token, secret) as { id: string };

        // Get user from database
        const user = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
            })
            .from(users)
            .where(eq(users.id, decoded.id))
            .limit(1);

        if (!user.length) {
            return res.status(401).json(
                createErrorResponse('UNAUTHORIZED', 'Invalid token')
            );
        }

        req.user = {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name || undefined,
            role: user[0].role,
        };
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json(
                createErrorResponse('UNAUTHORIZED', 'Invalid token')
            );
        }

        console.error('Auth middleware error:', error);
        return res.status(500).json(
            createErrorResponse('INTERNAL_ERROR', 'Authentication failed')
        );
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json(
                createErrorResponse('UNAUTHORIZED', 'Authentication required')
            );
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json(
                createErrorResponse('FORBIDDEN', 'Insufficient permissions')
            );
        }

        next();
    };
}; 