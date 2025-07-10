import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * Send a standardized success response
 */
export const sendSuccessResponse = (res: Response, data: any, message = 'Success', statusCode = 200): void => {
    const response: ApiResponse = {
        success: true,
        message,
        data,
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
    res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 */
export const sendErrorResponse = (
    res: Response,
    code: string,
    message: string,
    statusCode = 400,
    details?: Record<string, unknown>
): void => {
    const response: ApiResponse = {
        success: false,
        message,
        error: {
            code,
            message,
            details,
            timestamp: new Date().toISOString(),
        },
        meta: {
            timestamp: new Date().toISOString(),
        },
    };
    res.status(statusCode).json(response);
};

/**
 * Send a standardized internal server error response
 */
export const sendInternalErrorResponse = (res: Response, message = 'Internal server error'): void => {
    sendErrorResponse(res, 'INTERNAL_ERROR', message, 500);
};

/**
 * Send a standardized authentication error response
 */
export const sendAuthErrorResponse = (res: Response, message = 'Authentication required'): void => {
    sendErrorResponse(res, 'UNAUTHORIZED', message, 401);
};

/**
 * Send a standardized validation error response
 */
export const sendValidationErrorResponse = (res: Response, message: string): void => {
    sendErrorResponse(res, 'VALIDATION_ERROR', message, 400);
};

/**
 * Send a standardized not found error response
 */
export const sendNotFoundErrorResponse = (res: Response, message: string): void => {
    sendErrorResponse(res, 'NOT_FOUND', message, 404);
};

/**
 * Send a standardized forbidden error response
 */
export const sendForbiddenErrorResponse = (res: Response, message = 'Access denied'): void => {
    sendErrorResponse(res, 'FORBIDDEN', message, 403);
};

/**
 * Send a standardized conflict error response
 */
export const sendConflictErrorResponse = (res: Response, message: string): void => {
    sendErrorResponse(res, 'CONFLICT', message, 409);
};

/**
 * Handle service response and send appropriate HTTP response
 */
export const handleServiceResponse = (res: Response, serviceResponse: ApiResponse, successStatus = 200): void => {
    if (serviceResponse.success) {
        res.status(successStatus).json(serviceResponse);
    } else {
        // Determine appropriate status code based on error code
        let statusCode = 400;
        if (serviceResponse.error?.code === 'UNAUTHORIZED') {
            statusCode = 401;
        } else if (serviceResponse.error?.code === 'FORBIDDEN') {
            statusCode = 403;
        } else if (serviceResponse.error?.code === 'NOT_FOUND' || serviceResponse.error?.code === 'USER_NOT_FOUND' ||
            serviceResponse.error?.code === 'PRODUCT_NOT_FOUND' || serviceResponse.error?.code === 'ORDER_NOT_FOUND' ||
            serviceResponse.error?.code === 'CATEGORY_NOT_FOUND' || serviceResponse.error?.code === 'VARIANT_NOT_FOUND') {
            statusCode = 404;
        } else if (serviceResponse.error?.code === 'CONFLICT' || serviceResponse.error?.code === 'USER_EXISTS' ||
            serviceResponse.error?.code === 'EMAIL_EXISTS') {
            statusCode = 409;
        } else if (serviceResponse.error?.code === 'INTERNAL_ERROR') {
            statusCode = 500;
        }

        res.status(statusCode).json(serviceResponse);
    }
}; 