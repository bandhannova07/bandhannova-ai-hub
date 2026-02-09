import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.APP_ID_SECRET || 'bandhannova-default-secret-key-32-chars!!';
const APP_ID = 'BandhanNova-AI-Hub';

/**
 * Generates an encrypted application identification string.
 * This string is unique per request as it includes a timestamp, a random nonce,
 * and a platform-specific identifier to ensure no two providers receive the same pattern.
 * Format: base64(iv:encryptedData)
 */
export function generateAppIdHeader(platformName: string = 'generic'): string {
    try {
        const iv = crypto.randomBytes(16);
        // Ensure we have a 32-byte key
        const key = Buffer.alloc(32);
        const secretBuffer = SECRET_KEY.length >= 64 ? Buffer.from(SECRET_KEY, 'hex') : Buffer.from(SECRET_KEY);
        secretBuffer.copy(key);

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        const payload = JSON.stringify({
            appId: APP_ID,
            platform: platformName,
            timestamp: Date.now(),
            nonce: crypto.randomBytes(12).toString('hex')
        });

        let encrypted = cipher.update(payload, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        return `${iv.toString('base64')}:${encrypted}`;
    } catch (error) {
        console.error('Error generating App ID header:', error);
        return `fallback:${Buffer.from(`${APP_ID}-${platformName}`).toString('base64')}`;
    }
}

/**
 * Verifies (decrypts) an app identification header.
 * Primarily used for internal verification or testing.
 */
export function verifyAppIdHeader(header: string): any {
    try {
        const parts = header.split(':');
        if (parts.length < 2) return null;

        const iv = Buffer.from(parts[0], 'base64');
        const encryptedData = parts[1];

        if (iv.length !== 16) return null;

        const key = Buffer.alloc(32);
        const secretBuffer = SECRET_KEY.length >= 64 ? Buffer.from(SECRET_KEY, 'hex') : Buffer.from(SECRET_KEY);
        secretBuffer.copy(key);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Error verifying App ID header:', error);
        return null;
    }
}
