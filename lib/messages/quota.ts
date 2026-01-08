// Message Quota Management System
// Tracks daily message usage and bonus messages from watching ads

export interface MessageQuota {
    used: number;           // Messages used today
    limit: number;          // Daily limit (50 for free users)
    bonusMessages: number;  // Extra messages from watching ads
    lastReset: number;      // Timestamp of last reset
}

const QUOTA_KEY = 'messageQuota';
const FREE_USER_LIMIT = 1; // TESTING: Changed from 50 to 1 for video ad testing
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get current message quota from localStorage
 * Auto-resets if 24 hours have passed
 */
export function getMessageQuota(): MessageQuota {
    try {
        const stored = localStorage.getItem(QUOTA_KEY);

        if (!stored) {
            return createNewQuota();
        }

        const quota: MessageQuota = JSON.parse(stored);

        // Check if we need to reset (24 hours passed)
        const now = Date.now();
        if (now - quota.lastReset > RESET_INTERVAL) {
            return resetQuota(quota);
        }

        return quota;
    } catch (error) {
        console.error('Error getting message quota:', error);
        return createNewQuota();
    }
}

/**
 * Save message quota to localStorage
 */
export function saveMessageQuota(quota: MessageQuota): void {
    try {
        localStorage.setItem(QUOTA_KEY, JSON.stringify(quota));
    } catch (error) {
        console.error('Error saving message quota:', error);
    }
}

/**
 * Create a new quota object
 */
function createNewQuota(): MessageQuota {
    const quota: MessageQuota = {
        used: 0,
        limit: FREE_USER_LIMIT,
        bonusMessages: 0,
        lastReset: Date.now()
    };
    saveMessageQuota(quota);
    return quota;
}

/**
 * Reset quota for new day
 */
function resetQuota(oldQuota: MessageQuota): MessageQuota {
    const quota: MessageQuota = {
        used: 0,
        limit: oldQuota.limit,
        bonusMessages: 0,
        lastReset: Date.now()
    };
    saveMessageQuota(quota);
    return quota;
}

/**
 * Check if user can send a message
 */
export function canSendMessage(): boolean {
    const quota = getMessageQuota();
    const totalAvailable = quota.limit + quota.bonusMessages;
    return quota.used < totalAvailable;
}

/**
 * Get remaining messages count
 */
export function getRemainingMessages(): number {
    const quota = getMessageQuota();
    const totalAvailable = quota.limit + quota.bonusMessages;
    return Math.max(0, totalAvailable - quota.used);
}

/**
 * Increment message count when user sends a message
 */
export function incrementMessageCount(): void {
    const quota = getMessageQuota();
    quota.used += 1;
    saveMessageQuota(quota);
}

/**
 * Add bonus messages after watching ads
 */
export function addBonusMessages(count: number): void {
    const quota = getMessageQuota();
    quota.bonusMessages += count;
    saveMessageQuota(quota);
}

/**
 * Get quota stats for display
 */
export function getQuotaStats(): { used: number; total: number; remaining: number } {
    const quota = getMessageQuota();
    const total = quota.limit + quota.bonusMessages;
    const remaining = Math.max(0, total - quota.used);

    return {
        used: quota.used,
        total,
        remaining
    };
}
