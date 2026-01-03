// Subscription Checker - Auto-downgrade expired subscriptions
import { getAllDBs } from '@/lib/database/multi-db';

export interface SubscriptionStatus {
    plan: string;
    status: 'active' | 'cancelled' | 'expired' | 'none';
    expiresAt?: string;
    daysRemaining?: number;
}

/**
 * Check and update expired subscriptions
 * Returns current subscription status
 */
export async function checkAndUpdateExpiredSubscriptions(userId: string): Promise<SubscriptionStatus> {
    try {
        const databases = getAllDBs();
        let userDb = null;
        let profile = null;
        let subscription = null;

        // Find user's database
        for (const db of databases) {
            const { data: profileData } = await db
                .from('profiles')
                .select('plan')
                .eq('id', userId)
                .single();

            if (profileData) {
                userDb = db;
                profile = profileData;

                // Get subscription if exists
                const { data: subData } = await db
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                subscription = subData;
                break;
            }
        }

        if (!userDb || !profile) {
            return { plan: 'Free', status: 'none' };
        }

        // If no subscription, return current plan
        if (!subscription) {
            return { plan: profile.plan, status: 'none' };
        }

        const now = new Date();
        const expiresAt = new Date(subscription.expires_at);
        const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Check if subscription is expired
        if (subscription.status === 'cancelled' && expiresAt < now) {
            console.log(`⏰ Subscription expired for user ${userId}, downgrading to Free`);

            // Update profile to Free plan
            await userDb
                .from('profiles')
                .update({
                    plan: 'free',
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            // Update subscription status to expired
            await userDb
                .from('subscriptions')
                .update({
                    status: 'expired',
                    updated_at: new Date().toISOString()
                })
                .eq('id', subscription.id);

            return {
                plan: 'Free',
                status: 'expired',
                expiresAt: subscription.expires_at
            };
        }

        // Return current status
        return {
            plan: profile.plan,
            status: subscription.status,
            expiresAt: subscription.expires_at,
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0
        };

    } catch (error) {
        console.error('Error checking subscription:', error);
        return { plan: 'Free', status: 'none' };
    }
}

/**
 * Get subscription status display text
 */
export function getSubscriptionStatusText(status: SubscriptionStatus): string {
    if (status.status === 'none') {
        return 'Free Plan';
    }

    const planName = status.plan.charAt(0).toUpperCase() + status.plan.slice(1);

    if (status.status === 'active') {
        return `${planName} Plan - Renews on ${new Date(status.expiresAt!).toLocaleDateString()}`;
    }

    if (status.status === 'cancelled') {
        return `${planName} Plan - Active until ${new Date(status.expiresAt!).toLocaleDateString()} (${status.daysRemaining} days)`;
    }

    if (status.status === 'expired') {
        return 'Subscription Expired';
    }

    return `${planName} Plan`;
}
