// Prompt Cache Manager - Server-side memory cache for system prompts
// Reduces prompt generation overhead and improves response speed

interface CachedPrompt {
    content: string;
    createdAt: number;
    ttl: number; // Time to live in milliseconds
    hits: number; // Cache hit counter
}

interface CacheStats {
    totalEntries: number;
    totalHits: number;
    totalMisses: number;
    hitRate: number;
    memoryUsageKB: number;
    oldestEntry: number | null;
    newestEntry: number | null;
}

class PromptCacheManager {
    private cache: Map<string, CachedPrompt>;
    private hits: number;
    private misses: number;
    private maxEntries: number;
    private defaultTTL: number;

    constructor(maxEntries: number = 100, defaultTTL: number = 3600000) {
        this.cache = new Map();
        this.hits = 0;
        this.misses = 0;
        this.maxEntries = maxEntries;
        this.defaultTTL = defaultTTL; // 1 hour default
    }

    /**
     * Get cached prompt or generate new one
     */
    get(key: string, generator: () => string, ttl?: number): string {
        // Check if cached and not expired
        const cached = this.cache.get(key);
        const now = Date.now();

        if (cached && (now - cached.createdAt) < cached.ttl) {
            // Cache hit!
            cached.hits++;
            this.hits++;
            return cached.content;
        }

        // Cache miss - generate new
        this.misses++;
        const content = generator();

        // Store in cache
        this.set(key, content, ttl);

        return content;
    }

    /**
     * Set cache entry
     */
    set(key: string, content: string, ttl?: number): void {
        // Enforce max entries (LRU eviction)
        if (this.cache.size >= this.maxEntries && !this.cache.has(key)) {
            this.evictOldest();
        }

        this.cache.set(key, {
            content,
            createdAt: Date.now(),
            ttl: ttl || this.defaultTTL,
            hits: 0
        });
    }

    /**
     * Invalidate specific cache entry
     */
    invalidate(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        this.hits = 0;
        this.misses = 0;
    }

    /**
     * Cleanup expired entries
     */
    cleanup(): number {
        const now = Date.now();
        let removed = 0;

        for (const [key, cached] of this.cache.entries()) {
            if ((now - cached.createdAt) >= cached.ttl) {
                this.cache.delete(key);
                removed++;
            }
        }

        return removed;
    }

    /**
     * Evict oldest entry (LRU)
     */
    private evictOldest(): void {
        let oldestKey: string | null = null;
        let oldestTime = Infinity;

        for (const [key, cached] of this.cache.entries()) {
            if (cached.createdAt < oldestTime) {
                oldestTime = cached.createdAt;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    /**
     * Get cache statistics
     */
    getStats(): CacheStats {
        const entries = Array.from(this.cache.values());
        const totalRequests = this.hits + this.misses;

        // Calculate memory usage (rough estimate)
        let memoryBytes = 0;
        for (const cached of entries) {
            memoryBytes += cached.content.length * 2; // UTF-16 encoding
        }

        return {
            totalEntries: this.cache.size,
            totalHits: this.hits,
            totalMisses: this.misses,
            hitRate: totalRequests > 0 ? this.hits / totalRequests : 0,
            memoryUsageKB: Math.round(memoryBytes / 1024),
            oldestEntry: entries.length > 0
                ? Math.min(...entries.map(e => e.createdAt))
                : null,
            newestEntry: entries.length > 0
                ? Math.max(...entries.map(e => e.createdAt))
                : null
        };
    }

    /**
     * Get all cache keys
     */
    getKeys(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * Check if key exists and is valid
     */
    has(key: string): boolean {
        const cached = this.cache.get(key);
        if (!cached) return false;

        const now = Date.now();
        return (now - cached.createdAt) < cached.ttl;
    }
}

// Singleton instance
let cacheInstance: PromptCacheManager | null = null;

/**
 * Get global cache instance
 */
export function getPromptCache(): PromptCacheManager {
    if (!cacheInstance) {
        cacheInstance = new PromptCacheManager(
            100,        // Max 100 entries
            3600000     // 1 hour TTL
        );

        // Auto-cleanup every 10 minutes
        if (typeof setInterval !== 'undefined') {
            setInterval(() => {
                const removed = cacheInstance!.cleanup();
                if (removed > 0) {
                    console.log(`🧹 Cleaned up ${removed} expired cache entries`);
                }
            }, 600000); // 10 minutes
        }
    }

    return cacheInstance;
}

/**
 * Reset cache instance (for testing)
 */
export function resetPromptCache(): void {
    cacheInstance = null;
}

export default PromptCacheManager;
