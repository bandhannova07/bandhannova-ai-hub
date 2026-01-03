// Plan Guard - Access control based on plan limits
import { PlanName } from '../plans/config';
import { checkLimit, incrementUsage } from '../usage/tracker';

export interface GuardResult {
    allowed: boolean;
    message?: string;
    remaining?: number;
}

export function canSendMessage(
    planName: PlanName,
    messageType: 'conversational' | 'research' | 'agent',
    agentType?: string
): GuardResult {
    let feature: 'conversationalMessages' | 'researchChats' | 'agentMessages';

    switch (messageType) {
        case 'conversational':
            feature = 'conversationalMessages';
            break;
        case 'research':
            feature = 'researchChats';
            break;
        case 'agent':
            feature = 'agentMessages';
            break;
    }

    const result = checkLimit(planName, feature, agentType);

    if (!result.allowed) {
        return {
            allowed: false,
            message: getUpgradeMessage(planName, messageType),
            remaining: 0
        };
    }

    return {
        allowed: true,
        remaining: result.remaining
    };
}

export function recordMessage(
    messageType: 'conversational' | 'research' | 'agent',
    agentType?: string
): void {
    let feature: 'conversationalMessages' | 'researchChats' | 'agentMessages';

    switch (messageType) {
        case 'conversational':
            feature = 'conversationalMessages';
            break;
        case 'research':
            feature = 'researchChats';
            break;
        case 'agent':
            feature = 'agentMessages';
            break;
    }

    incrementUsage(feature, agentType);
}

export function canGenerateImage(planName: PlanName): GuardResult {
    const result = checkLimit(planName, 'imageGeneration');

    if (!result.allowed) {
        return {
            allowed: false,
            message: `Daily image generation limit reached! Upgrade to ${getNextPlan(planName)} for more images.`,
            remaining: 0
        };
    }

    return {
        allowed: true,
        remaining: result.remaining
    };
}

export function recordImageGeneration(): void {
    incrementUsage('imageGeneration');
}

function getUpgradeMessage(planName: PlanName, messageType: string): string {
    const nextPlan = getNextPlan(planName);
    const messages: Record<string, string> = {
        conversational: `Daily message limit reached! Upgrade to ${nextPlan} for more conversations.`,
        research: `Daily research chat limit reached! Upgrade to ${nextPlan} for more research.`,
        agent: `Daily agent message limit reached! Upgrade to ${nextPlan} for more AI interactions.`
    };

    return messages[messageType] || 'Daily limit reached! Please upgrade your plan.';
}

function getNextPlan(currentPlan: PlanName): string {
    const upgradePath: Record<PlanName, string> = {
        Free: 'Pro (₹249/month)',
        Pro: 'Ultra (₹699/month)',
        Ultra: 'Maxx (₹1,999/month)',
        Maxx: 'Maxx' // Already at top
    };

    return upgradePath[currentPlan];
}

export function getUserPlan(): PlanName {
    try {
        const plan = localStorage.getItem('userPlan') as PlanName;
        return plan || 'Free';
    } catch {
        return 'Free';
    }
}

export function setUserPlan(plan: PlanName): void {
    try {
        localStorage.setItem('userPlan', plan);
    } catch (error) {
        console.error('Error setting user plan:', error);
    }
}
