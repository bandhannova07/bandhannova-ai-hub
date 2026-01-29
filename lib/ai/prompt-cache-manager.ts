// Prompt Cache Manager - KeyDB/Redis Implementation
// Shared server-side memory cache for system prompts

import { keydb } from '@/lib/cache/keydb';

interface CachedPrompt {
    content: string;
    createdAt: number;
}

const DEFAULT_TTL = 3600; // 1 hour in seconds

class PromptCacheManager {
    private prefix: string = 'cache:prompt:';

    constructor() { }

    /**
     * Get cached prompt or generate new one
     */
    async get(key: string, generator: () => string, ttlSeconds: number = DEFAULT_TTL): Promise<string> {
        const cacheKey = this.prefix + key;
        const redis = keydb.getClient();

        try {
            // Try to get from Redis
            const cachedContent = await redis.get(cacheKey);

            if (cachedContent) {
                // Record hit (fire and forget)
                // redis.incr(`${cacheKey}:hits`).catch(() => {});
                return cachedContent;
            }

            // Cache miss - generate new
            const content = generator();

            // Store in cache
            if (content) {
                await redis.setex(cacheKey, ttlSeconds, content);
            }

            return content;
        } catch (error) {
            console.warn('⚠️ Cache error, falling back to generator:', error);
            // Fallback to generator if Redis fails
            return generator();
        }
    }

    /**
     * Manually set a cache entry
     */
    async set(key: string, content: string, ttlSeconds: number = DEFAULT_TTL): Promise<void> {
        const cacheKey = this.prefix + key;
        const redis = keydb.getClient();
        try {
            await redis.setex(cacheKey, ttlSeconds, content);
        } catch (error) {
            console.warn('⚠️ Cache set error:', error);
        }
    }

    /**
     * Invalidate specific cache entry
     */
    async invalidate(key: string): Promise<void> {
        const cacheKey = this.prefix + key;
        const redis = keydb.getClient();
        await redis.del(cacheKey);
    }
}

// Singleton instance
export const promptCache = new PromptCacheManager();

// Helper for backward compatibility or simple import
export function getPromptCache(): PromptCacheManager {
    return promptCache;
}

