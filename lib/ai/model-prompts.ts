// Model Identity Prompt Generator
// Defines the JSON-structured identity for each AI model family

import { ModelId } from './model-tiers';

export function getModelIdentityPrompt(modelId: ModelId): string {
    const modelFamily = getModelFamily(modelId);

    const identity = {
        model_identity: {
            name: getModelDisplayName(modelId),
            family: modelFamily,
            capabilities: getModelCapabilities(modelFamily),
            optimization_goal: getModelOptimizationGoal(modelFamily)
        }
    };

    return JSON.stringify(identity, null, 2);
}

function getModelFamily(modelId: string): 'Ispat' | 'Barud' | 'BandhanNova' {
    if (modelId.includes('ispat')) return 'Ispat';
    if (modelId.includes('barud')) return 'Barud';
    if (modelId.includes('bandhannova')) return 'BandhanNova';
    return 'BandhanNova'; // Default fallback
}

function getModelDisplayName(modelId: string): string {
    // Map IDs to clean names
    const names: Record<string, string> = {
        'ispat-v2-flash': 'BDN: Ispat V2 Flash',
        'ispat-v2-pro': 'BDN: Ispat V2 Pro',
        'ispat-v2-ultra': 'BDN: Ispat V2 Ultra',
        'ispat-v2-maxx': 'BDN: Ispat V2 Maxx',
        'barud-2-smart-fls': 'Barud 2 Smart-Flash',
        'barud-2-smart-pro': 'Barud 2 Smart-Pro',
        'barud-2-smart-ult': 'Barud 2 Smart-Ultra',
        'barud-2-smart-max': 'Barud 2 Smart-Maxx',
        'bandhannova-2-extreme': 'BandhanNova 2.0 eXtreme'
    };
    return names[modelId] || modelId;
}

function getModelCapabilities(family: 'Ispat' | 'Barud' | 'BandhanNova'): string[] {
    switch (family) {
        case 'Ispat':
            return ['High Speed', 'Efficiency', 'Concise Responses', 'Low Latency'];
        case 'Barud':
            return ['Balanced Intelligence', 'Smart Reasoning', 'Detailed Explanations', 'Context Awareness'];
        case 'BandhanNova':
            return ['Deep Research', 'Complex Problem Solving', 'Advanced Reasoning', 'Maximum Creativity'];
    }
}

function getModelOptimizationGoal(family: 'Ispat' | 'Barud' | 'BandhanNova'): string {
    switch (family) {
        case 'Ispat':
            return "Prioritize speed and brevity. Get straight to the point.";
        case 'Barud':
            return "Prioritize clarity and helpfulness. Provide balanced details.";
        case 'BandhanNova':
            return "Prioritize depth and accuracy. Think deeply and provide comprehensive answers.";
    }
}
