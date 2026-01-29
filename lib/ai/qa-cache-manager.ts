// QA Cache Manager - KeyDB/Redis Implementation
// Caches User Query -> LLM Response pairs for instant answers

import { keydb } from '@/lib/cache/keydb';
import crypto from 'crypto';

interface CachedResponse {
    content: string;
    createdAt: number;
    modelId: string;
}

const QA_TTL = 86400 * 7; // 7 days in seconds

class QACacheManager {
    private prefix: string = 'cache:qa:';

    constructor() { }

    /**
     * Generate a deterministic hash for a query
     * Normalizes text (lowercase, trimmed) to improve hit rate
     */
    private generateKey(message: string, modelId: string): string {
        const normalized = message.trim().toLowerCase();
        const hash = crypto.createHash('sha256').update(normalized).digest('hex');
        return `${this.prefix}${modelId}:${hash}`;
    }

    /**
     * Get cached response
     */
    async get(message: string, modelId: string): Promise<string | null> {
        const key = this.generateKey(message, modelId);
        const redis = keydb.getClient();

        try {
            const cached = await redis.get(key);
            if (cached) {
                // Determine if it looks like JSON or raw text.
                // For simplicity, we store just the text content.
                return cached;
            }
        } catch (error) {
            console.warn('⚠️ QA Cache Get Error:', error);
        }

        return null;
    }

    /**
     * Set cache entry
     */
    async set(message: string, modelId: string, content: string): Promise<void> {
        // Don't cache very short responses or errors
        if (!content || content.length < 5 || content.includes('Error')) {
            return;
        }

        const key = this.generateKey(message, modelId);
        const redis = keydb.getClient();

        try {
            await redis.setex(key, QA_TTL, content);
        } catch (error) {
            console.warn('⚠️ QA Cache Set Error:', error);
        }
    }
}

export const qaCache = new QACacheManager();
