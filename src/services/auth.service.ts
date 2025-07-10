import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import {
    createSuccessResponse,
    createErrorResponse,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    UserInfo,
    ApiResponse
} from '../types';

export class AuthService {
    private readonly saltRounds = 10;
    private readonly jwtSecret: string;

    constructor() {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }
        this.jwtSecret = secret;
    }

    async registerUser(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const { email, password } = data;

            if (!email || !password) {
                return createErrorResponse('VALIDATION_ERROR', 'Email and password are required');
            }

            // Check if user already exists
            const existingUser = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (existingUser.length > 0) {
                return createErrorResponse('USER_EXISTS', 'User with this email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);

            // Create user
            const newUser = await db
                .insert(users)
                .values({
                    email,
                    password: hashedPassword,
                    name: email.split('@')[0], // Default name from email
                })
                .returning();

            // Generate JWT 
            const token = jwt.sign(
                { id: newUser[0].id },
                this.jwtSecret,
                { expiresIn: '7d' }
            );

            const userInfo: UserInfo = {
                id: newUser[0].id,
                email: newUser[0].email,
                name: newUser[0].name || undefined,
                role: newUser[0].role as any,
                createdAt: newUser[0].createdAt.toISOString(),
            };

            const authResponse: AuthResponse = {
                token,
                user: userInfo,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            };

            return createSuccessResponse(authResponse, 'User registered successfully');
        } catch (error) {
            console.error('Registration error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to register user');
        }
    }

    async loginUser(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        try {
            const { email, password } = data;

            if (!email || !password) {
                return createErrorResponse('VALIDATION_ERROR', 'Email and password are required');
            }

            // Find user
            const user = await db
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);

            if (!user.length) {
                return createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user[0].password);
            if (!isValidPassword) {
                return createErrorResponse('INVALID_CREDENTIALS', 'Invalid email or password');
            }

            // Update last login
            await db
                .update(users)
                .set({ lastLoginAt: new Date() })
                .where(eq(users.id, user[0].id));

            // Generate JWT token
            const token = jwt.sign(
                { id: user[0].id },
                this.jwtSecret,
                { expiresIn: '7d' }
            );

            const userInfo: UserInfo = {
                id: user[0].id,
                email: user[0].email,
                name: user[0].name || undefined,
                role: user[0].role as any,
                createdAt: user[0].createdAt.toISOString(),
                lastLoginAt: user[0].lastLoginAt?.toISOString(),
            };

            const authResponse: AuthResponse = {
                token,
                user: userInfo,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
            };

            return createSuccessResponse(authResponse, 'Login successful');
        } catch (error) {
            console.error('Login error:', error);
            return createErrorResponse('INTERNAL_ERROR', 'Failed to login');
        }
    }

    verifyToken(token: string): { id: string } | null {
        try {
            // verify token
            const decoded = jwt.verify(token, this.jwtSecret) as { id: string };
            return decoded;
        } catch (error) {
            return null;
        }
    }

    generateToken(userId: string): string {
        return jwt.sign({ id: userId }, this.jwtSecret, { expiresIn: '7d' });
    }
} 