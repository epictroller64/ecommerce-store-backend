import path from 'path';

export class StaticService {

    async getFilePath(filePath: string) {
        const fullPath = path.join(__dirname, '..', '..', 'static', filePath);
        return fullPath;
    }

    getContentType(ext: string): string | null {
        const contentTypes: { [key: string]: string } = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.pdf': 'application/pdf',
            '.txt': 'text/plain',
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.zip': 'application/zip',
            '.mp4': 'video/mp4',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.avi': 'video/x-msvideo',
            '.mov': 'video/quicktime'
        };

        return contentTypes[ext] || null;
    }
}