// Redis Pool Manager (Supports KeyDB & Upstash Rotation)
// Rotates specific operations across multiple Redis connections to distribute load

import Redis from 'ioredis';

class RedisPoolManager {
    private static instance: RedisPoolManager;
    private clients: Redis[] = [];
    private connectionUrls: string[] = [];

    private constructor() {
        this.loadConnectionUrls();
        this.initializePool();
    }

    public static getInstance(): RedisPoolManager {
        if (!RedisPoolManager.instance) {
            RedisPoolManager.instance = new RedisPoolManager();
        }
        return RedisPoolManager.instance;
    }

    /**
     * Load all available Redis URLs from env
     */
    private loadConnectionUrls() {
        // 1. Check for dedicated KeyDB URL
        if (process.env.KEYDB_URL) {
            this.connectionUrls.push(process.env.KEYDB_URL);
        }

        // 2. Check for rotated Upstash URLs (1-5)
        for (let i = 1; i <= 5; i++) {
            const url = process.env[`UPSTASH_REDIS_URL_${i}`];
            if (url && url.length > 5) {
                this.connectionUrls.push(url);
            }
        }

        // Fallback default if nothing configured
        if (this.connectionUrls.length === 0) {
            this.connectionUrls.push('redis://localhost:6379');
        }

        console.log(`🔌 Redis Pool Initialized with ${this.connectionUrls.length} connections.`);
    }

    /**
     * Initialize all clients in the pool
     */
    private initializePool() {
        this.connectionUrls.forEach((url, index) => {
            const client = new Redis(url, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => Math.min(times * 50, 2000),
                lazyConnect: true,
                connectionName: `bandhannova-pool-${index}`
            });

            // Silent error handling to prevent crashing on one bad connection
            client.on('error', (err) => {
                // console.warn(`⚠️ Redis Pool Client ${index} Error:`, err.message);
            });

            this.clients.push(client);
        });
    }

    /**
     * Get a random client from the pool
     * basic load balancing strategy
     */
    public getClient(): Redis {
        if (this.clients.length === 0) {
            // Should not happen, but safe fallback
            return new Redis('redis://localhost:6379');
        }
        const randomIndex = Math.floor(Math.random() * this.clients.length);
        return this.clients[randomIndex];
    }

    /**
     * Get a specific client (sticky session)
     */
    public getClientByIndex(index: number): Redis {
        return this.clients[index % this.clients.length];
    }

    /**
     * Get all clients (for broadcast operations like flush)
     */
    public getAllClients(): Redis[] {
        return this.clients;
    }
}

export const keydb = RedisPoolManager.getInstance();
