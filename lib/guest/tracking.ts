// Guest Credit Tracking with Redis
// Tracks guest user queries by IP address with 48-hour TTL

import { redisPool } from '../cache/redis';

const GUEST_LIMIT = 5;
const GUEST_TTL = 48 * 60 * 60; // 48 hours in seconds

export interface GuestStatus {
    remaining: number;
    total: number;
    resetAt: string | null;
}

export interface GuestTrackResult {
    success: boolean;
    remaining: number;
    total: number;
    resetAt?: string;
    error?: string;
}

interface GuestData {
    ip: string;
    count: number;
    firstQuery: string;
    lastQuery: string;
}

/**
 * Get guest status by IP address
 */
export async function getGuestStatus(ip: string): Promise<GuestStatus> {
    try {
        const redis = redisPool.getClient();
        const key = `guest:ip:${ip}`;
        const data = await redis.get(key);

        if (!data) {
            return { remaining: GUEST_LIMIT, total: GUEST_LIMIT, resetAt: null };
        }

        const parsed: GuestData = JSON.parse(data);
        const remaining = Math.max(0, GUEST_LIMIT - parsed.count);
        const resetAt = new Date(parsed.firstQuery);
        resetAt.setHours(resetAt.getHours() + 48);

        return {
            remaining,
            total: GUEST_LIMIT,
            resetAt: resetAt.toISOString(),
        };
    } catch (error) {
        console.error('Error getting guest status:', error);
        // Fallback to default on error
        return { remaining: GUEST_LIMIT, total: GUEST_LIMIT, resetAt: null };
    }
}

/**
 * Track a guest query and decrement credits
 */
export async function trackGuestQuery(ip: string): Promise<GuestTrackResult> {
    try {
        const redis = redisPool.getClient();
        const key = `guest:ip:${ip}`;
        const data = await redis.get(key);

        if (!data) {
            // First query from this IP
            const newData: GuestData = {
                ip,
                count: 1,
                firstQuery: new Date().toISOString(),
                lastQuery: new Date().toISOString(),
            };
            await redis.setex(key, GUEST_TTL, JSON.stringify(newData));

            return {
                success: true,
                remaining: GUEST_LIMIT - 1,
                total: GUEST_LIMIT,
            };
        }

        const parsed: GuestData = JSON.parse(data);

        // Check if limit reached
        if (parsed.count >= GUEST_LIMIT) {
            const resetAt = new Date(parsed.firstQuery);
            resetAt.setHours(resetAt.getHours() + 48);

            return {
                success: false,
                remaining: 0,
                total: GUEST_LIMIT,
                resetAt: resetAt.toISOString(),
                error: 'Guest limit reached',
            };
        }

        // Increment count
        parsed.count += 1;
        parsed.lastQuery = new Date().toISOString();

        // Update Redis with same TTL
        await redis.setex(key, GUEST_TTL, JSON.stringify(parsed));

        const resetAt = new Date(parsed.firstQuery);
        resetAt.setHours(resetAt.getHours() + 48);

        return {
            success: true,
            remaining: GUEST_LIMIT - parsed.count,
            total: GUEST_LIMIT,
            resetAt: resetAt.toISOString(),
        };
    } catch (error) {
        console.error('Error tracking guest query:', error);
        return {
            success: false,
            remaining: 0,
            total: GUEST_LIMIT,
            error: 'Internal error',
        };
    }
}

/**
 * Reset guest credits for an IP (admin function)
 */
export async function resetGuestCredits(ip: string): Promise<boolean> {
    try {
        const redis = redisPool.getClient();
        const key = `guest:ip:${ip}`;
        await redis.del(key);
        return true;
    } catch (error) {
        console.error('Error resetting guest credits:', error);
        return false;
    }
}
