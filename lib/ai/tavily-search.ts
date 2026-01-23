// Tavily AI Search Manager with Multi-API Key Rotation
// Handles rate limits by automatically switching between available API keys

import { tavily } from '@tavily/core';

interface TavilySearchResult {
    query: string;
    results: Array<{
        title: string;
        url: string;
        content: string;
        score: number;
    }>;
    answer?: string;
    images?: string[];
}

interface APIKeyStatus {
    key: string;
    isAvailable: boolean;
    lastUsed: number;
    errorCount: number;
}

class TavilySearchManager {
    private apiKeys: APIKeyStatus[];
    private currentKeyIndex: number;
    private maxRetries: number;

    constructor() {
        // Load all Tavily API keys from environment
        this.apiKeys = this.loadAPIKeys();
        this.currentKeyIndex = 0;
        this.maxRetries = 3;
    }

    /**
     * Load all Tavily API keys from environment variables
     */
    private loadAPIKeys(): APIKeyStatus[] {
        const keys: APIKeyStatus[] = [];
        let index = 1;

        while (true) {
            const key = process.env[`TAVILY_API_KEY_${index}`];
            if (!key) break;

            keys.push({
                key,
                isAvailable: true,
                lastUsed: 0,
                errorCount: 0
            });
            index++;
        }

        if (keys.length === 0) {
            console.warn('⚠️ No Tavily API keys found in environment variables');
        } else {
            console.log(`✅ Loaded ${keys.length} Tavily API key(s)`);
        }

        return keys;
    }

    /**
     * Get next available API key (with rate limit handling)
     */
    private getNextAvailableKey(): string | null {
        if (this.apiKeys.length === 0) {
            return null;
        }

        // Try to find an available key
        for (let i = 0; i < this.apiKeys.length; i++) {
            const keyStatus = this.apiKeys[this.currentKeyIndex];

            if (keyStatus.isAvailable) {
                keyStatus.lastUsed = Date.now();
                const key = keyStatus.key;

                // Move to next key for next request (round-robin)
                this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;

                return key;
            }

            // Move to next key
            this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        }

        // All keys are unavailable - reset the oldest one
        const oldestKey = this.apiKeys.reduce((oldest, current) =>
            current.lastUsed < oldest.lastUsed ? current : oldest
        );

        oldestKey.isAvailable = true;
        oldestKey.errorCount = 0;

        return oldestKey.key;
    }

    /**
     * Mark API key as rate limited
     */
    private markKeyAsRateLimited(apiKey: string): void {
        const keyStatus = this.apiKeys.find(k => k.key === apiKey);
        if (keyStatus) {
            keyStatus.isAvailable = false;
            keyStatus.errorCount++;

            // Auto-reset after 60 seconds
            setTimeout(() => {
                keyStatus.isAvailable = true;
                keyStatus.errorCount = 0;
                console.log('🔄 Tavily API key reset and available again');
            }, 60000);
        }
    }

    /**
     * Perform AI search with automatic retry and key rotation
     */
    async search(
        query: string,
        options: {
            searchDepth?: 'basic' | 'advanced';
            maxResults?: number;
            includeAnswer?: boolean;
            includeImages?: boolean;
        } = {}
    ): Promise<TavilySearchResult | null> {
        const {
            searchDepth = 'advanced',
            maxResults = 5,
            includeAnswer = true,
            includeImages = false
        } = options;

        let lastError: Error | null = null;

        // Try with different API keys
        for (let attempt = 0; attempt < this.maxRetries; attempt++) {
            const apiKey = this.getNextAvailableKey();

            if (!apiKey) {
                console.error('❌ No Tavily API keys available');
                return null;
            }

            try {
                console.log(`🔍 Searching with Tavily (attempt ${attempt + 1}/${this.maxRetries})...`);

                const client = tavily({ apiKey });
                const response = await client.search(query, {
                    searchDepth,
                    maxResults,
                    includeAnswer,
                    includeImages
                });

                console.log(`✅ Tavily search successful`);

                // Return properly typed response
                return {
                    query: response.query,
                    results: response.results,
                    answer: response.answer,
                    images: response.images?.map((img: any) =>
                        typeof img === 'string' ? img : img.url
                    )
                };

            } catch (error: any) {
                lastError = error;

                // Check if rate limited
                if (error.message?.includes('rate limit') || error.status === 429) {
                    console.warn(`⚠️ Tavily API key rate limited, switching to next key...`);
                    this.markKeyAsRateLimited(apiKey);
                    continue;
                }

                // Other errors - log and retry
                console.error(`❌ Tavily search error:`, error.message);

                // Don't retry for certain errors
                if (error.status === 401 || error.status === 403) {
                    break;
                }
            }
        }

        console.error('❌ All Tavily search attempts failed:', lastError?.message);
        return null;
    }

    /**
     * Perform advanced AI research (for Deep Research AI only)
     * Uses Tavily's research API with polling for completion
     */
    async research(
        query: string,
        options: {
            maxResults?: number;
            includeImages?: boolean;
        } = {}
    ): Promise<{
        content: string;
        sources: Array<{ title: string; url: string; }>;
        status: 'completed' | 'failed';
    } | null> {
        const apiKey = this.getNextAvailableKey();

        if (!apiKey) {
            console.error('❌ No Tavily API keys available for research');
            return null;
        }

        try {
            console.log(`🔬 Starting advanced research with Tavily...`);

            const client = tavily({ apiKey });

            // Start research task
            const { request_id } = await client.research(query, options);
            console.log(`📋 Research task started: ${request_id}`);

            // Poll for results
            const pollForResults = async (): Promise<any> => {
                let attempts = 0;
                const maxAttempts = 30; // 60 seconds max (30 * 2s)

                while (attempts < maxAttempts) {
                    const result = await client.getResearch(request_id);

                    if (result.status === 'completed') {
                        console.log(`✅ Research completed successfully`);
                        return {
                            content: result.content,
                            sources: result.sources,
                            status: 'completed'
                        };
                    } else if (result.status === 'failed') {
                        console.error('❌ Research failed');
                        return {
                            content: '',
                            sources: [],
                            status: 'failed'
                        };
                    }

                    // Still processing
                    console.log(`⏳ Research in progress... (${attempts + 1}/${maxAttempts})`);
                    await new Promise(r => setTimeout(r, 2000)); // Wait 2 seconds
                    attempts++;
                }

                // Timeout
                console.warn('⚠️ Research timeout after 60 seconds');
                return {
                    content: '',
                    sources: [],
                    status: 'failed'
                };
            };

            return await pollForResults();

        } catch (error: any) {
            console.error(`❌ Research error:`, error.message);

            // Check if rate limited
            if (error.message?.includes('rate limit') || error.status === 429) {
                this.markKeyAsRateLimited(apiKey);
            }

            return null;
        }
    }

    /**
     * Get search manager statistics
     */
    getStats() {
        return {
            totalKeys: this.apiKeys.length,
            availableKeys: this.apiKeys.filter(k => k.isAvailable).length,
            currentKeyIndex: this.currentKeyIndex,
            keys: this.apiKeys.map(k => ({
                isAvailable: k.isAvailable,
                errorCount: k.errorCount,
                lastUsed: k.lastUsed > 0 ? new Date(k.lastUsed).toISOString() : 'Never'
            }))
        };
    }
}

// Singleton instance
let searchManagerInstance: TavilySearchManager | null = null;

/**
 * Get global Tavily search manager instance
 */
export function getTavilySearchManager(): TavilySearchManager {
    if (!searchManagerInstance) {
        searchManagerInstance = new TavilySearchManager();
    }
    return searchManagerInstance;
}

/**
 * Quick search helper function
 */
export async function searchWithTavily(
    query: string,
    searchDepth: 'basic' | 'advanced' = 'advanced'
): Promise<TavilySearchResult | null> {
    const manager = getTavilySearchManager();
    return manager.search(query, { searchDepth });
}

/**
 * Advanced research helper (for Deep Research AI)
 */
export async function researchWithTavily(
    query: string
): Promise<{
    content: string;
    sources: Array<{ title: string; url: string; }>;
    status: 'completed' | 'failed';
} | null> {
    const manager = getTavilySearchManager();
    return manager.research(query);
}

export default TavilySearchManager;
