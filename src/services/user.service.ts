import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import {
    createSuccessResponse,
    createErrorResponse,
    UpdateUserSettingsRequest,
    UserInfo,
    UserFrontend,
    ApiResponse
} from '../types';

export class UserService {
    async getUserById(userId: string): Promise<ApiResponse<UserInfo>> {
        try {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user.length) {
                return createErrorResponse('USER_NOT_FOUND', 'User not found');
            }

            const userInfo: UserInfo = {
                id: user[0].id,
                email: user[0].email,
                name: user[0].name || undefined,
                role: user[0].role as any,
                createdAt: user[0].createdAt.toISOString(),
                lastLoginAt: user[0].lastLoginAt?.toISOString(),
            };

            return createSuccessResponse(userInfo, 'User retrieved successfully');
        } catch (error) {
            console.error('Get user error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch user');
        }
    }


    async getUserByEmail(email: string): Promise<ApiResponse<UserInfo>> {
        try {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (!user.length) {
                return createErrorResponse('USER_NOT_FOUND', 'User not found');
            }

            const userInfo: UserInfo = {
                id: user[0].id,
                email: user[0].email,
                name: user[0].name || undefined,
                role: user[0].role as any,
                createdAt: user[0].createdAt.toISOString(),
                lastLoginAt: user[0].lastLoginAt?.toISOString(),
            };

            return createSuccessResponse(userInfo, 'User retrieved successfully');
        } catch (error) {
            console.error('Get user error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch user');
        }
    }

    async updateUserSettings(userId: string, data: UpdateUserSettingsRequest): Promise<ApiResponse<UserInfo>> {
        try {
            const updateData: Partial<typeof users.$inferInsert> = {};

            if (data.name !== undefined) {
                updateData.name = data.name;
            }

            if (data.email !== undefined) {
                // Check if email is already taken by another user
                const existingUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, data.email))
                    .limit(1);

                if (existingUser.length > 0 && existingUser[0].id !== userId) {
                    return createErrorResponse('EMAIL_EXISTS', 'Email is already taken');
                }

                updateData.email = data.email;
            }

            if (Object.keys(updateData).length === 0) {
                return createErrorResponse('VALIDATION_ERROR', 'No fields to update');
            }

            updateData.updatedAt = new Date();

            const updatedUser = await db
                .update(users)
                .set(updateData)
                .where(eq(users.id, userId))
                .returning();

            if (!updatedUser.length) {
                return createErrorResponse('USER_NOT_FOUND', 'User not found');
            }

            const userInfo: UserInfo = {
                id: updatedUser[0].id,
                email: updatedUser[0].email,
                name: updatedUser[0].name || undefined,
                role: updatedUser[0].role as any,
                createdAt: updatedUser[0].createdAt.toISOString(),
                lastLoginAt: updatedUser[0].lastLoginAt?.toISOString(),
            };

            return createSuccessResponse(userInfo, 'User settings updated successfully');
        } catch (error) {
            console.error('Update user settings error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to update user settings');
        }
    }

    async getUserForFrontend(userId: string): Promise<ApiResponse<UserFrontend>> {
        try {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!user.length) {
                return createErrorResponse('USER_NOT_FOUND', 'User not found');
            }

            const userFrontend: UserFrontend = {
                id: user[0].id,
                name: user[0].name || '',
                email: user[0].email,
                role: user[0].role,
                createdAt: user[0].createdAt.toISOString(),
                updatedAt: user[0].updatedAt.toISOString(),
            };

            return createSuccessResponse(userFrontend, 'User retrieved successfully');
        } catch (error) {
            console.error('Get user for frontend error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to fetch user');
        }
    }
} 