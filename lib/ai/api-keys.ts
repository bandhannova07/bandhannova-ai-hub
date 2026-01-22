// API Key Management System
// Manages OpenRouter API keys for different subscription tiers

import { SubscriptionTier } from './model-tiers';

export type ApiKeyTier = 'free' | 'pro' | 'ultra' | 'maxx' | 'extreme';

/**
 * Get the appropriate OpenRouter API key based on tier
 */
export function getApiKeyForTier(tier: ApiKeyTier): string {
    const apiKeys: Record<ApiKeyTier, string | undefined> = {
        free: process.env.OPENROUTER_API_KEY_FREE,
        pro: process.env.OPENROUTER_API_KEY_PRO,
        ultra: process.env.OPENROUTER_API_KEY_ULTRA,
        maxx: process.env.OPENROUTER_API_KEY_MAXX,
        extreme: process.env.OPENROUTER_API_KEY_EXTREME
    };

    const apiKey = apiKeys[tier];

    if (!apiKey) {
        console.error(`❌ API key not found for tier: ${tier}`);
        throw new Error(`API key not configured for tier: ${tier}`);
    }

    return apiKey;
}

/**
 * Validate that all required API keys are configured
 */
export function validateApiKeys(): { valid: boolean; missing: ApiKeyTier[] } {
    const tiers: ApiKeyTier[] = ['free', 'pro', 'ultra', 'maxx', 'extreme'];
    const missing: ApiKeyTier[] = [];

    for (const tier of tiers) {
        try {
            getApiKeyForTier(tier);
        } catch {
            missing.push(tier);
        }
    }

    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Map subscription tier to API key tier
 */
export function subscriptionTierToApiKeyTier(subscriptionTier: SubscriptionTier): ApiKeyTier {
    // Subscription tiers map directly to API key tiers
    return subscriptionTier as ApiKeyTier;
}
