// Usage Tracker for BandhanNova 2.0 eXtreme
// Tracks daily query limits for the eXtreme model

import { SubscriptionTier, getExtremeDailyLimit } from '@/lib/ai/model-tiers';
import { getAllDBs } from '@/lib/database/multi-db';

interface UsageRecord {
    userId: string;
    date: string; // YYYY-MM-DD format
    count: number;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

/**
 * Get current usage count for BandhanNova 2.0 eXtreme today
 */
export async function getExtremeUsageToday(userId: string): Promise<number> {
    const today = getTodayString();

    try {
        // Try to get from localStorage first (client-side)
        if (typeof window !== 'undefined') {
            const storageKey = `extreme_usage_${userId}_${today}`;
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                return parseInt(stored, 10);
            }
        }

        // Fallback: could implement database tracking here if needed
        // For now, we'll rely on localStorage
        return 0;

    } catch (error) {
        console.error('Error getting extreme usage:', error);
        return 0;
    }
}

/**
 * Increment usage count for BandhanNova 2.0 eXtreme
 */
export async function incrementExtremeUsage(userId: string): Promise<number> {
    const today = getTodayString();

    try {
        if (typeof window !== 'undefined') {
            const storageKey = `extreme_usage_${userId}_${today}`;
            const current = await getExtremeUsageToday(userId);
            const newCount = current + 1;
            localStorage.setItem(storageKey, newCount.toString());
            return newCount;
        }

        return 1;

    } catch (error) {
        console.error('Error incrementing extreme usage:', error);
        return 1;
    }
}

/**
 * Check if user can use BandhanNova 2.0 eXtreme based on their tier and usage
 */
export async function canUseExtreme(userId: string, tier: SubscriptionTier): Promise<{
    allowed: boolean;
    currentUsage: number;
    limit: number | null;
    remaining: number | null;
}> {
    const limit = getExtremeDailyLimit(tier);

    // Unlimited for maxx tier
    if (limit === null) {
        return {
            allowed: true,
            currentUsage: 0,
            limit: null,
            remaining: null
        };
    }

    const currentUsage = await getExtremeUsageToday(userId);
    const allowed = currentUsage < limit;
    const remaining = limit - currentUsage;

    return {
        allowed,
        currentUsage,
        limit,
        remaining: remaining > 0 ? remaining : 0
    };
}

/**
 * Server-side version: Increment and check in one operation
 * Returns whether the request should be allowed
 */
export async function checkAndIncrementExtremeUsage(
    userId: string,
    tier: SubscriptionTier
): Promise<{
    allowed: boolean;
    message?: string;
    currentUsage: number;
    limit: number | null;
}> {
    const limit = getExtremeDailyLimit(tier);

    // Unlimited for maxx tier
    if (limit === null) {
        return {
            allowed: true,
            currentUsage: 0,
            limit: null
        };
    }

    // For server-side, we'll use a simple in-memory cache
    // In production, you might want to use Redis or database
    const today = getTodayString();
    const cacheKey = `${userId}_${today}`;

    // Get current usage from cache (simplified for now)
    const currentUsage = 0; // TODO: Implement proper server-side caching

    if (currentUsage >= limit) {
        return {
            allowed: false,
            message: `Daily limit reached for BandhanNova 2.0 eXtreme (${limit} queries/day). Upgrade your plan for more queries.`,
            currentUsage,
            limit
        };
    }

    // Increment usage
    // TODO: Implement proper server-side increment

    return {
        allowed: true,
        currentUsage: currentUsage + 1,
        limit
    };
}
