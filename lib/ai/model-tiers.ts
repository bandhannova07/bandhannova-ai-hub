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
    | 'bandhannova-2-extreme'
    | 'groq-llama3-70b'
    | 'groq-mixtral-8x7b';

export interface ModelConfig {
    id: ModelId;
    name: string;
    displayName: string;
    description: string;
    primaryModel: string;
    fallbackModels: string[];
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
        displayName: '⚡ Ispat V2 Flash',
        description: 'Fast and efficient for quick responses',
        primaryModel: 'google/gemma-3-27b-it:free', // Changed from llama - better Bengali support
        fallbackModels: [
            'mistralai/mistral-small-3.1-24b-instruct:free',
            'nvidia/nemotron-nano-12b-v2-vl:free'
        ],
        minTier: 'free',
        temperature: 0.7,
        maxTokens: 4000
    },

    'ispat-v2-pro': {
        id: 'ispat-v2-pro',
        name: 'BDN: Ispat V2 Pro',
        displayName: '🔵 Ispat V2 Pro',
        description: 'Professional-grade responses with balanced performance',
        primaryModel: 'arcee-ai/trinity-mini:free',
        fallbackModels: [
            'nvidia/nemotron-nano-9b-v2:free',
            'nvidia/nemotron-nano-12b-v2-vl:free'
        ],
        minTier: 'pro',
        temperature: 0.7,
        maxTokens: 4500
    },

    'ispat-v2-ultra': {
        id: 'ispat-v2-ultra',
        name: 'BDN: Ispat V2 Ultra',
        displayName: '🟣 Ispat V2 Ultra',
        description: 'Advanced reasoning and complex problem solving',
        primaryModel: 'tngtech/tng-r1t-chimera:free',
        fallbackModels: [
            'qwen/qwen3-next-80b-a3b-instruct:free',
            'deepseek/deepseek-r1-0528:free',
            'tngtech/tng-r1t-chimera:free'
        ],
        minTier: 'ultra',
        temperature: 0.6,
        maxTokens: 6000
    },

    'ispat-v2-maxx': {
        id: 'ispat-v2-maxx',
        name: 'BDN: Ispat V2 Maxx',
        displayName: '🔴 Ispat V2 Maxx',
        description: 'Maximum intelligence and reasoning capabilities',
        primaryModel: 'tngtech/deepseek-r1t2-chimera:free',
        fallbackModels: [
            'tngtech/tng-r1t-chimera:free',
            'deepseek/deepseek-r1-0528:free'
        ],
        minTier: 'maxx',
        temperature: 0.6,
        maxTokens: 8000
    },

    // Barud 2 Smart Series
    'barud-2-smart-fls': {
        id: 'barud-2-smart-fls',
        name: 'Barud 2 Smart-fls',
        displayName: '⚡ Barud 2 Smart-fls',
        description: 'Smart and fast responses for everyday tasks',
        primaryModel: 'google/gemma-3-27b-it:free',
        fallbackModels: [
            'mistralai/mistral-small-3.1-24b-instruct:free',
            'qwen/qwen-2.5-vl-7b-instruct:free'
        ],
        minTier: 'free',
        temperature: 0.7,
        maxTokens: 4000
    },

    'barud-2-smart-pro': {
        id: 'barud-2-smart-pro',
        name: 'Barud 2 Smart-pro',
        displayName: '🔵 Barud 2 Smart-pro',
        description: 'Professional smart assistant for complex queries',
        primaryModel: 'arcee-ai/trinity-mini:free',
        fallbackModels: [
            'nvidia/nemotron-nano-9b-v2:free',
            'tngtech/tng-r1t-chimera:free'
        ],
        minTier: 'pro',
        temperature: 0.7,
        maxTokens: 4500
    },

    'barud-2-smart-ult': {
        id: 'barud-2-smart-ult',
        name: 'Barud 2 Smart-ult',
        displayName: '🟣 Barud 2 Smart-ult',
        description: 'Ultimate smart assistant with advanced capabilities',
        primaryModel: 'nvidia/nemotron-nano-12b-v2-vl:free',
        fallbackModels: [
            'arcee-ai/trinity-mini:free',
            'tngtech/deepseek-r1t2-chimera:free'
        ],
        minTier: 'ultra',
        temperature: 0.7,
        maxTokens: 6000
    },

    'barud-2-smart-max': {
        id: 'barud-2-smart-max',
        name: 'Barud 2 Smart-max',
        displayName: '🔴 Barud 2 Smart-max',
        description: 'Maximum smart capabilities with dual model power',
        primaryModel: 'meta-llama/llama-3.1-405b-instruct:free',
        fallbackModels: [
            'tngtech/tng-r1t-chimera:free',
            'tngtech/deepseek-r1t2-chimera:free',
            'deepseek/deepseek-r1-0528:free'
        ],
        minTier: 'maxx',
        temperature: 0.7,
        maxTokens: 8000
    },

    // BandhanNova 2.0 eXtreme (Special Research Model)
    'bandhannova-2-extreme': {
        id: 'bandhannova-2-extreme',
        name: 'BandhanNova 2.0 eXtreme',
        displayName: '🧠 BandhanNova 2.0 eXtreme',
        description: 'Most intelligent model for research and complex analysis',
        primaryModel: 'tngtech/tng-r1t-chimera:free',
        fallbackModels: [
            'tngtech/deepseek-r1t2-chimera:free',
            'tngtech/deepseek-r1t-chimera:free'
        ],
        minTier: 'free',
        temperature: 0.5,
        maxTokens: 10000,
        isExtreme: true
    },

    // Groq Models
    'groq-llama3-70b': {
        id: 'groq-llama3-70b',
        name: 'Groq Llama 3.3 70B',
        displayName: '⚡ Groq Llama 3.3',
        description: 'Ultra-fast inference with Llama 3.3 70B',
        primaryModel: 'llama-3.3-70b-versatile', // Updated to supported model
        fallbackModels: ['llama-3.1-8b-instant'],
        minTier: 'free',
        temperature: 0.7,
        maxTokens: 8192
    },
    'groq-mixtral-8x7b': {
        id: 'groq-mixtral-8x7b',
        name: 'Groq Mixtral 8x7B',
        displayName: '⚡ Groq Mixtral',
        description: 'High performance Mixtral model on Groq LPU',
        primaryModel: 'mixtral-8x7b-32768',
        fallbackModels: ['llama3-70b-8192'],
        minTier: 'pro',
        temperature: 0.7,
        maxTokens: 32768
    }
};

// Tier-based model access configuration
export const TIER_MODEL_ACCESS: Record<SubscriptionTier, ModelId[]> = {
    free: [
        'ispat-v2-flash',
        'barud-2-smart-fls',
        'bandhannova-2-extreme',
        'groq-llama3-70b'
    ],
    pro: [
        'ispat-v2-flash',
        'barud-2-smart-fls',
        'ispat-v2-pro',
        'barud-2-smart-pro',
        'bandhannova-2-extreme',
        'groq-llama3-70b',
        'groq-mixtral-8x7b'
    ],
    ultra: [
        'ispat-v2-flash',
        'barud-2-smart-fls',
        'ispat-v2-pro',
        'barud-2-smart-pro',
        'ispat-v2-ultra',
        'barud-2-smart-ult',
        'bandhannova-2-extreme',
        'groq-llama3-70b',
        'groq-mixtral-8x7b'
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
        'bandhannova-2-extreme',
        'groq-llama3-70b',
        'groq-mixtral-8x7b'
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
 * Get the API key tier for a model
 * This determines which OpenRouter API key to use
 */
export function getApiKeyTier(modelId: ModelId): 'free' | 'pro' | 'ultra' | 'maxx' | 'extreme' {
    const model = AI_MODELS[modelId];

    if (model.isExtreme) {
        return 'extreme';
    }

    // Map model's minimum tier to API key tier
    return model.minTier;
}

/**
 * Get all model IDs for a tier
 */
export function getModelIdsForTier(tier: SubscriptionTier): ModelId[] {
    return TIER_MODEL_ACCESS[tier];
}
