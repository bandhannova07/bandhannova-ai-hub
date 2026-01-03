// Usage Tracking System - localStorage based
import { PlanName, getPlanLimits, isUnlimited } from '../plans/config';

interface DailyUsage {
    date: string; // YYYY-MM-DD format
    conversationalMessages: number;
    imageGeneration: number;
    researchChats: number;
    agentMessages: {
        [agentType: string]: number;
    };
}

const USAGE_KEY = 'daily_usage';

function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

function getUsage(): DailyUsage {
    try {
        const stored = localStorage.getItem(USAGE_KEY);
        if (!stored) {
            return createNewUsage();
        }

        const usage: DailyUsage = JSON.parse(stored);

        // Reset if date changed
        if (usage.date !== getTodayDate()) {
            return createNewUsage();
        }

        return usage;
    } catch (error) {
        console.error('Error reading usage:', error);
        return createNewUsage();
    }
}

function createNewUsage(): DailyUsage {
    return {
        date: getTodayDate(),
        conversationalMessages: 0,
        imageGeneration: 0,
        researchChats: 0,
        agentMessages: {}
    };
}

function saveUsage(usage: DailyUsage): void {
    try {
        localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    } catch (error) {
        console.error('Error saving usage:', error);
    }
}

export function checkLimit(
    planName: PlanName,
    feature: 'conversationalMessages' | 'imageGeneration' | 'researchChats' | 'agentMessages',
    agentType?: string
): { allowed: boolean; remaining: number; message?: string } {
    const limits = getPlanLimits(planName);
    const usage = getUsage();

    let limit: number;
    let used: number;

    if (feature === 'agentMessages' && agentType) {
        limit = limits.agentMessages;
        used = usage.agentMessages[agentType] || 0;
    } else {
        limit = limits[feature] as number;
        used = usage[feature] as number;
    }

    // Unlimited plan
    if (isUnlimited(limit)) {
        return { allowed: true, remaining: -1 };
    }

    // Check if limit reached
    if (used >= limit) {
        return {
            allowed: false,
            remaining: 0,
            message: `Daily limit reached! You've used ${used}/${limit} ${feature}. Upgrade for more!`
        };
    }

    return {
        allowed: true,
        remaining: limit - used
    };
}

export function incrementUsage(
    feature: 'conversationalMessages' | 'imageGeneration' | 'researchChats' | 'agentMessages',
    agentType?: string
): void {
    const usage = getUsage();

    if (feature === 'agentMessages' && agentType) {
        usage.agentMessages[agentType] = (usage.agentMessages[agentType] || 0) + 1;
    } else {
        (usage[feature] as number)++;
    }

    saveUsage(usage);
}

export function getRemainingQuota(planName: PlanName, feature: string): string {
    const limits = getPlanLimits(planName);
    const usage = getUsage();

    const limit = (limits as any)[feature];
    const used = (usage as any)[feature] || 0;

    if (isUnlimited(limit)) {
        return 'Unlimited';
    }

    return `${used}/${limit}`;
}

export function resetUsage(): void {
    saveUsage(createNewUsage());
}

export function getUsageStats(planName: PlanName) {
    const usage = getUsage();
    const limits = getPlanLimits(planName);

    return {
        conversational: {
            used: usage.conversationalMessages,
            limit: limits.conversationalMessages,
            remaining: isUnlimited(limits.conversationalMessages)
                ? -1
                : limits.conversationalMessages - usage.conversationalMessages
        },
        images: {
            used: usage.imageGeneration,
            limit: limits.imageGeneration,
            remaining: isUnlimited(limits.imageGeneration)
                ? -1
                : limits.imageGeneration - usage.imageGeneration
        },
        research: {
            used: usage.researchChats,
            limit: limits.researchChats,
            remaining: isUnlimited(limits.researchChats)
                ? -1
                : limits.researchChats - usage.researchChats
        }
    };
}
