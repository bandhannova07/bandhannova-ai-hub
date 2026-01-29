// Model Tier Configuration System
// Defines all AI models, their fallback chains, and subscription tier access

export type SubscriptionTier = 'free' | 'pro' | 'ultra' | 'maxx';

export type ModelId =
    | 'ispat-v2-flash'
    | 'ispat-v2-pro'
    | 'ispat-v2-ultra'
    | 'ispat-v2-maxx'
    | 'barud-2-smart-fls'
    | 'barud-2-smart-pro'
    | 'barud-2-smart-ult'
    | 'barud-2-smart-max'
    | 'bandhannova-2-extreme';

export type AIProvider = 'openrouter' | 'groq' | 'gemini';

export interface ModelBackend {
    provider: AIProvider;
    modelId: string;
}

export interface ModelConfig {
    id: ModelId;
    name: string;
    displayName: string;
    description: string;
    backends: ModelBackend[];
    minTier: SubscriptionTier;
    temperature: number;
    maxTokens: number;
    isExtreme?: boolean; // Special flag for BandhanNova 2.0 eXtreme
}

// All available AI models with their configurations
export const AI_MODELS: Record<ModelId, ModelConfig> = {
    // BDN: Ispat V2 Series
    'ispat-v2-flash': {
        id: 'ispat-v2-flash',
        name: 'BDN: Ispat V2 Flash',
        displayName: 'BDN: Ispat V2 Flash',
        description: 'Fast and efficient for quick responses',
        backends: [
            { provider: 'openrouter', modelId: 'upstage/solar-pro-3:free' },
            { provider: 'groq', modelId: 'llama-3.3-70b-versatile' },
            { provider: 'gemini', modelId: 'gemini-2.0-flash' }
        ],
        minTier: 'free',
        temperature: 0.7,
        maxTokens: 4000
    },

    'ispat-v2-pro': {
        id: 'ispat-v2-pro',
        name: 'BDN: Ispat V2 Pro',
        displayName: 'BDN: Ispat V2 Pro',
        description: 'Professional-grade responses with balanced performance',
        backends: [
            { provider: 'openrouter', modelId: 'arcee-ai/trinity-mini:free' },
            { provider: 'groq', modelId: 'mixtral-8x7b-32768' },
            { provider: 'gemini', modelId: 'gemini-2.0-flash' }
        ],
        minTier: 'pro',
        temperature: 0.7,
        maxTokens: 4500
    },

    'ispat-v2-ultra': {
        id: 'ispat-v2-ultra',
        name: 'BDN: Ispat V2 Ultra',
        displayName: 'BDN: Ispat V2 Ultra',
        description: 'Advanced reasoning and complex problem solving',
        backends: [
            { provider: 'openrouter', modelId: 'tngtech/tng-r1t-chimera:free' },
            { provider: 'gemini', modelId: 'gemini-2.0-pro-exp-02-05' },
            { provider: 'groq', modelId: 'llama-3.3-70b-versatile' }
        ],
        minTier: 'ultra',
        temperature: 0.6,
        maxTokens: 6000
    },

    'ispat-v2-maxx': {
        id: 'ispat-v2-maxx',
        name: 'BDN: Ispat V2 Maxx',
        displayName: 'BDN: Ispat V2 Maxx',
        description: 'Maximum intelligence and reasoning capabilities',
        backends: [
            { provider: 'openrouter', modelId: 'tngtech/deepseek-r1t2-chimera:free' },
            { provider: 'gemini', modelId: 'gemini-2.0-pro-exp-02-05' },
            { provider: 'openrouter', modelId: 'deepseek/deepseek-r1-0528:free' }
        ],
        minTier: 'maxx',
        temperature: 0.6,
        maxTokens: 8000
    },

    // Barud 2 Smart Series
    'barud-2-smart-fls': {
        id: 'barud-2-smart-fls',
        name: 'Barud 2 Smart-fls',
        displayName: 'BDN: Barud 2 Smart-fls',
        description: 'Smart and fast responses for everyday tasks',
        backends: [
            { provider: 'openrouter', modelId: 'google/gemma-3-27b-it:free' },
            { provider: 'groq', modelId: 'llama-3.3-70b-versatile' },
            { provider: 'gemini', modelId: 'gemini-2.0-flash' }
        ],
        minTier: 'free',
        temperature: 0.7,
        maxTokens: 4000
    },

    'barud-2-smart-pro': {
        id: 'barud-2-smart-pro',
        name: 'Barud 2 Smart-pro',
        displayName: 'BDN: Barud 2 Smart-pro',
        description: 'Professional smart assistant for complex queries',
        backends: [
            { provider: 'openrouter', modelId: 'arcee-ai/trinity-mini:free' },
            { provider: 'groq', modelId: 'mixtral-8x7b-32768' },
            { provider: 'gemini', modelId: 'gemini-2.0-flash' }
        ],
        minTier: 'pro',
        temperature: 0.7,
        maxTokens: 4500
    },

    'barud-2-smart-ult': {
        id: 'barud-2-smart-ult',
        name: 'Barud 2 Smart-ult',
        displayName: 'BDN: Barud 2 Smart-ult',
        description: 'Ultimate smart assistant with advanced capabilities',
        backends: [
            { provider: 'openrouter', modelId: 'nvidia/nemotron-nano-12b-v2-vl:free' },
            { provider: 'gemini', modelId: 'gemini-2.0-pro-exp-02-05' },
            { provider: 'groq', modelId: 'llama-3.3-70b-versatile' }
        ],
        minTier: 'ultra',
        temperature: 0.7,
        maxTokens: 6000
    },

    'barud-2-smart-max': {
        id: 'barud-2-smart-max',
        name: 'Barud 2 Smart-max',
        displayName: 'BDN: Barud 2 Smart-max',
        description: 'Maximum smart capabilities with dual model power',
        backends: [
            { provider: 'openrouter', modelId: 'meta-llama/llama-3.1-405b-instruct:free' },
            { provider: 'gemini', modelId: 'gemini-2.0-pro-exp-02-05' },
            { provider: 'openrouter', modelId: 'tngtech/deepseek-r1t2-chimera:free' }
        ],
        minTier: 'maxx',
        temperature: 0.7,
        maxTokens: 8000
    },

    // BandhanNova 2.0 eXtreme (Special Research Model)
    'bandhannova-2-extreme': {
        id: 'bandhannova-2-extreme',
        name: 'BandhanNova 2.0 eXtreme',
        displayName: 'BandhanNova 2.0 eXtreme',
        description: 'Most intelligent model for research and complex analysis',
        backends: [
            { provider: 'openrouter', modelId: 'tngtech/tng-r1t-chimera:free' },
            { provider: 'gemini', modelId: 'gemini-2.0-pro-exp-02-05' },
            { provider: 'openrouter', modelId: 'tngtech/deepseek-r1t2-chimera:free' }
        ],
        minTier: 'free',
        temperature: 0.5,
        maxTokens: 10000,
        isExtreme: true
    }
};

// Tier-based model access configuration
export const TIER_MODEL_ACCESS: Record<SubscriptionTier, ModelId[]> = {
    free: [
        'ispat-v2-flash',
        'barud-2-smart-fls',
        'bandhannova-2-extreme'
    ],
    pro: [
        'ispat-v2-flash',
        'barud-2-smart-fls',
        'ispat-v2-pro',
        'barud-2-smart-pro',
        'bandhannova-2-extreme'
    ],
    ultra: [
        'ispat-v2-flash',
        'barud-2-smart-fls',
        'ispat-v2-pro',
        'barud-2-smart-pro',
        'ispat-v2-ultra',
        'barud-2-smart-ult',
        'bandhannova-2-extreme'
    ],
    maxx: [
        'ispat-v2-flash',
        'barud-2-smart-fls',
        'ispat-v2-pro',
        'barud-2-smart-pro',
        'ispat-v2-ultra',
        'barud-2-smart-ult',
        'ispat-v2-maxx',
        'barud-2-smart-max',
        'bandhannova-2-extreme'
    ]
};

// Daily query limits for BandhanNova 2.0 eXtreme
export const EXTREME_DAILY_LIMITS: Record<SubscriptionTier, number | null> = {
    free: 10,
    pro: 20,
    ultra: 50,
    maxx: null // null = unlimited
};

// Helper functions

/**
 * Get all models available for a subscription tier
 */
export function getModelsForTier(tier: SubscriptionTier): ModelConfig[] {
    const modelIds = TIER_MODEL_ACCESS[tier];
    return modelIds.map(id => AI_MODELS[id]);
}

/**
 * Check if a user has access to a specific model
 */
export function hasModelAccess(tier: SubscriptionTier, modelId: ModelId): boolean {
    return TIER_MODEL_ACCESS[tier].includes(modelId);
}

/**
 * Get model configuration by ID
 */
export function getModelConfig(modelId: ModelId): ModelConfig | null {
    return AI_MODELS[modelId] || null;
}

/**
 * Get daily limit for BandhanNova 2.0 eXtreme based on tier
 * Returns null for unlimited
 */
export function getExtremeDailyLimit(tier: SubscriptionTier): number | null {
    return EXTREME_DAILY_LIMITS[tier];
}



/**
 * Get all model IDs for a tier
 */
export function getModelIdsForTier(tier: SubscriptionTier): ModelId[] {
    return TIER_MODEL_ACCESS[tier];
}
