// AI Model Configurations
// Centralized configuration for all AI models and their fallback chains

export type AIMode = 'quick' | 'normal' | 'thinking';

export interface ModelConfig {
    primary: string;
    fallbacks: string[];
}

export const AI_MODELS = {
    // Vision models for image/video processing
    vision: {
        primary: 'nvidia/nemotron-nano-12b-v2-vl:free',
        fallback: 'qwen/qwen-2.5-vl-7b-instruct:free',
    },

    // Conversational AI models with mode-based routing
    conversational: {
        quick: {
            primary: 'nvidia/nemotron-3-nano-30b-a3b:free',
            fallbacks: [
                'xiaomi/mimo-v2-flash:free',
                'arcee-ai/trinity-mini:free',
            ],
        } as ModelConfig,
        normal: {
            primary: 'nvidia/nemotron-3-nano-30b-a3b:free',
            fallbacks: [
                'xiaomi/mimo-v2-flash:free',
                'tngtech/tng-r1t-chimera:free',
                'arcee-ai/trinity-mini:free',
            ],
        } as ModelConfig,
        thinking: {
            primary: 'nvidia/nemotron-3-nano-30b-a3b:free',
            fallbacks: [
                'xiaomi/mimo-v2-flash:free',
                'tngtech/tng-r1t-chimera:free',
                'arcee-ai/trinity-mini:free',
            ],
        } as ModelConfig,
    },
};

// Model timeout configurations (in milliseconds)
export const MODEL_TIMEOUTS = {
    vision: 20000,      // 20s for vision models
    quick: 15000,       // 15s for quick mode (was 5s)
    normal: 25000,      // 25s for normal mode (was 8s)
    thinking: 35000,    // 35s for thinking mode (was 12s)
    maxTotal: 60000,    // 60s maximum total time
};

// Get model chain for a specific mode
export function getModelChain(mode: AIMode): string[] {
    const config = AI_MODELS.conversational[mode];
    return [config.primary, ...config.fallbacks];
}

// Get timeout for a specific mode
export function getTimeout(mode: AIMode): number {
    return MODEL_TIMEOUTS[mode];
}

// Model metadata for display/logging
export const MODEL_METADATA = {
    'nvidia/nemotron-3-nano-30b-a3b:free': {
        name: 'Nemotron Nano',
        provider: 'NVIDIA',
        speed: 'fast',
        quality: 'high',
    },
    'xiaomi/mimo-v2-flash:free': {
        name: 'Mimo Flash',
        provider: 'Xiaomi',
        speed: 'very-fast',
        quality: 'medium',
    },
    'tngtech/tng-r1t-chimera:free': {
        name: 'Chimera',
        provider: 'TNG',
        speed: 'medium',
        quality: 'high',
    },
    'arcee-ai/trinity-mini:free': {
        name: 'Trinity Mini',
        provider: 'Arcee',
        speed: 'fast',
        quality: 'medium',
    },
    'nvidia/nemotron-nano-12b-v2-vl:free': {
        name: 'Nemotron Vision',
        provider: 'NVIDIA',
        speed: 'medium',
        quality: 'high',
    },
    'qwen/qwen-2.5-vl-7b-instruct:free': {
        name: 'Qwen Vision',
        provider: 'Qwen',
        speed: 'fast',
        quality: 'medium',
    },
};
