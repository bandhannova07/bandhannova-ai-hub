// Plan Configuration - All limits and features
export const PLAN_LIMITS = {
    Free: {
        conversationalMessages: 20,
        imageGeneration: 5,
        researchChats: 5,
        agentMessages: 15,
        memoryLimit: 10,
        languages: ['en', 'hi', 'bn'], // English, Hindi, Bengali
        models: ['ispat-v2-fast', 'barud2-pro', 'barud3'],
        features: {
            webSearch: true,
            memoryType: 'limited',
            agentMemory: false
        }
    },
    Pro: {
        conversationalMessages: 30,
        imageGeneration: 10,
        researchChats: 15,
        agentMessages: 25,
        memoryLimit: 50,
        languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu'], // + Tamil, Telugu, Marathi, Gujarati
        models: ['ispat-v2-fast', 'ispat-v3-pro', 'barud2-pro', 'barud3', 'barud3-maxx'],
        features: {
            webSearch: true,
            memoryType: 'expanded',
            agentMemory: true
        }
    },
    Ultra: {
        conversationalMessages: 50,
        imageGeneration: 25,
        researchChats: 30,
        agentMessages: 50,
        memoryLimit: 200,
        languages: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'as', 'or', 'ml'], // + Assamese, Odia, Malayalam
        models: ['all'], // All models available
        features: {
            webSearch: true,
            memoryType: 'ultra-fast',
            agentMemory: true
        }
    },
    Maxx: {
        conversationalMessages: -1, // Unlimited
        imageGeneration: -1, // Unlimited
        researchChats: -1, // Unlimited
        agentMessages: -1, // Unlimited
        memoryLimit: -1, // Unlimited
        languages: ['all'], // All languages
        models: ['all'], // All models
        features: {
            webSearch: true,
            memoryType: 'ultra-fast',
            agentMemory: true,
            neverForget: true
        }
    }
};

export type PlanName = 'Free' | 'Pro' | 'Ultra' | 'Maxx';

export function getPlanLimits(planName: PlanName) {
    return PLAN_LIMITS[planName] || PLAN_LIMITS.Free;
}

export function isUnlimited(limit: number): boolean {
    return limit === -1;
}

export function getPlanPrice(planName: PlanName): number {
    const prices: Record<PlanName, number> = {
        Free: 0,
        Pro: 249,
        Ultra: 699,
        Maxx: 1999
    };
    return prices[planName];
}
