// Database Helper: Get User Subscription Tier
// Fetches user's subscription tier from the database

import { getAllDBs } from '@/lib/database/multi-db';
import { SubscriptionTier } from '@/lib/ai/model-tiers';

export interface UserTierInfo {
    tier: SubscriptionTier;
    isExpired: boolean;
    expiresAt: Date | null;
}

/**
 * Get user's subscription tier from database
 * Returns 'free' if user not found or subscription expired
 */
export async function getUserTier(userId: string): Promise<UserTierInfo> {
    try {
        // Query user profile from database
        const { data: profile, error } = await getAllDBs()[0]
            .from('profiles')
            .select('plan, plan_expiry')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            console.log(`User ${userId} not found, defaulting to free tier`);
            return {
                tier: 'free',
                isExpired: false,
                expiresAt: null
            };
        }

        const tier = profile.plan as SubscriptionTier;
        const expiryDate = profile.plan_expiry ? new Date(profile.plan_expiry) : null;

        // Check if subscription is expired
        const isExpired = expiryDate ? expiryDate < new Date() : false;

        if (isExpired) {
            console.log(`User ${userId} subscription expired, falling back to free tier`);
            return {
                tier: 'free',
                isExpired: true,
                expiresAt: expiryDate
            };
        }

        return {
            tier,
            isExpired: false,
            expiresAt: expiryDate
        };

    } catch (error) {
        console.error('Error fetching user tier:', error);
        // Default to free tier on error
        return {
            tier: 'free',
            isExpired: false,
            expiresAt: null
        };
    }
}

/**
 * Get user tier without full info (just the tier string)
 */
export async function getUserTierSimple(userId: string): Promise<SubscriptionTier> {
    const info = await getUserTier(userId);
    return info.tier;
}
