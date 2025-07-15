import { Request, Response, NextFunction } from 'express';

// ANSI color codes for colorful logging
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m'
};

// Helper function to get status color
const getStatusColor = (status: number): string => {
    if (status >= 200 && status < 300) return colors.green;
    if (status >= 300 && status < 400) return colors.blue;
    if (status >= 400 && status < 500) return colors.yellow;
    if (status >= 500) return colors.red;
    return colors.white;
};

// Helper function to get method color
const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
        case 'GET': return colors.green;
        case 'POST': return colors.blue;
        case 'PUT': return colors.yellow;
        case 'PATCH': return colors.magenta;
        case 'DELETE': return colors.red;
        default: return colors.white;
    }
};

// Helper function to truncate long strings
const truncate = (str: string, length: number = 100): string => {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
};

// Helper function to format JSON for display
const formatBody = (body: any): string => {
    if (!body || Object.keys(body).length === 0) {
        return colors.dim + '(empty)' + colors.reset;
    }

    try {
        const formatted = JSON.stringify(body, null, 2);
        return truncate(formatted, 200);
    } catch {
        return colors.dim + '(unserializable)' + colors.reset;
    }
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const methodColor = getMethodColor(method);

    // Log request
    console.log('\n' + '='.repeat(80));
    console.log(`${colors.bright}${colors.cyan}🌐 NEW REQUEST${colors.reset}`);
    console.log(`${colors.bright}${methodColor}${method}${colors.reset} ${colors.white}${url}${colors.reset}`);
    console.log(`${colors.dim}📅 ${new Date().toISOString()}${colors.reset}`);

    // Log request headers (filtered)
    const relevantHeaders = ['authorization', 'content-type', 'user-agent', 'accept'];
    const headers = relevantHeaders
        .filter(header => req.headers[header])
        .map(header => `${colors.yellow}${header}:${colors.reset} ${req.headers[header]}`)
        .join('\n  ');

    if (headers) {
        console.log(`${colors.bright}📋 Headers:${colors.reset}\n  ${headers}`);
    }

    // Log request body
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`${colors.bright}📦 Request Body:${colors.reset}`);
        console.log(formatBody(req.body));
    }

    // Log query parameters
    if (req.query && Object.keys(req.query).length > 0) {
        console.log(`${colors.bright}🔍 Query Params:${colors.reset}`);
        console.log(formatBody(req.query));
    }

    // Override res.json to capture response body
    const originalJson = res.json;
    res.json = function (data: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusColor = getStatusColor(res.statusCode);

        // Log response
        console.log(`${colors.bright}📤 RESPONSE${colors.reset}`);
        console.log(`${colors.bright}${statusColor}Status: ${res.statusCode}${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`);

        // Log response body
        console.log(`${colors.bright}📦 Response Body:${colors.reset}`);
        console.log(formatBody(data));

        console.log('='.repeat(80) + '\n');

        // Call original json method
        return originalJson.call(this, data);
    };

    // Handle cases where res.json is not called (like res.send, res.end, etc.)
    const originalSend = res.send;
    res.send = function (data: any) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusColor = getStatusColor(res.statusCode);

        // Log response
        console.log(`${colors.bright}📤 RESPONSE${colors.reset}`);
        console.log(`${colors.bright}${statusColor}Status: ${res.statusCode}${colors.reset} ${colors.dim}(${duration}ms)${colors.reset}`);

        // Log response body
        console.log(`${colors.bright}📦 Response Body:${colors.reset}`);
        if (typeof data === 'string') {
            console.log(truncate(data, 200));
        } else {
            console.log(formatBody(data));
        }

        console.log('='.repeat(80) + '\n');

        // Call original send method
        return originalSend.call(this, data);
    };

    next();
}; 