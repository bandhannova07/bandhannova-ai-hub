// Plan Helper Functions
import { PlanName, getPlanLimits } from './config';

/**
 * Get current user's plan from localStorage
 */
export function getCurrentPlan(): PlanName {
    try {
        const plan = localStorage.getItem('userPlan');
        if (plan && ['Free', 'Pro', 'Ultra', 'Maxx'].includes(plan)) {
            return plan as PlanName;
        }
        return 'Free';
    } catch {
        return 'Free';
    }
}

/**
 * Get allowed models for a plan
 */
export function getModelsByPlan(plan: PlanName): string[] {
    const limits = getPlanLimits(plan);

    if (limits.models.includes('all')) {
        // All models available for Ultra and Maxx
        return [
            'ispat-v2-fast',
            'ispat-v3-pro',
            'ispat-v3-ultra',
            'ispat-v3-maxx',
            'barud2-pro',
            'barud3',
            'barud3-maxx'
        ];
    }

    return limits.models;
}

/**
 * Check if user can access a specific model
 */
export function canAccessModel(plan: PlanName, modelId: string): boolean {
    const allowedModels = getModelsByPlan(plan);
    return allowedModels.includes(modelId);
}

/**
 * Get model display name with plan badge
 */
export function getModelDisplayName(modelId: string, userPlan: PlanName): {
    name: string;
    locked: boolean;
    requiredPlan?: string;
} {
    const modelNames: Record<string, string> = {
        'ispat-v2-fast': 'Ispat v2 Fast',
        'ispat-v3-pro': 'Ispat v3 Pro',
        'ispat-v3-ultra': 'Ispat v3 Ultra',
        'ispat-v3-maxx': 'Ispat v3 Maxx',
        'barud2-pro': 'Barud2 Pro',
        'barud3': 'Barud3',
        'barud3-maxx': 'Barud3 Maxx'
    };

    const locked = !canAccessModel(userPlan, modelId);
    let requiredPlan: string | undefined;

    if (locked) {
        // Determine which plan is needed
        if (canAccessModel('Pro', modelId)) {
            requiredPlan = 'Pro';
        } else if (canAccessModel('Ultra', modelId)) {
            requiredPlan = 'Ultra';
        }
    }

    return {
        name: modelNames[modelId] || modelId,
        locked,
        requiredPlan
    };
}

/**
 * Get allowed languages for a plan
 */
export function getLanguagesByPlan(plan: PlanName): string[] {
    const limits = getPlanLimits(plan);

    if (limits.languages.includes('all')) {
        return [
            'en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu',
            'as', 'or', 'ml', 'kn', 'pa'
        ];
    }

    return limits.languages;
}

/**
 * Check if user can access a language
 */
export function canAccessLanguage(plan: PlanName, languageCode: string): boolean {
    const allowedLanguages = getLanguagesByPlan(plan);
    return allowedLanguages.includes(languageCode);
}
