// Agent Prompt Manager
// Dynamically loads the correct prompt based on agent type

import { creatorSocialPrompt } from './agents/creator-social';
import { creativeProductivityPrompt } from './agents/creative-productivity';
import { psychologyPersonalityPrompt } from './agents/psychology-personality';
import { studyLearningPrompt } from './agents/study-learning';
import { futureJobsCareerPrompt } from './agents/future-jobs-career';
import { decisionMakerPrompt } from './agents/decision-maker';
import { websiteBuilderPrompt } from './agents/website-builder';
import { imageMakerPrompt } from './agents/image-maker';
import { kitchenRecipePrompt } from './agents/kitchen-recipe';
import { searchEnginePrompt } from './agents/search-engine';
import { getConversationalAgentPrompt } from './agents/conversational';
import { getOptimizedPrompt } from './optimized-prompts';

type AgentPromptMap = Record<string, string | ((mode: any) => string)>;

const AGENT_PROMPTS: AgentPromptMap = {
    'creator-social': creatorSocialPrompt,
    'creative-productivity': creativeProductivityPrompt,
    'psychology-personality': psychologyPersonalityPrompt,
    'study-learning': studyLearningPrompt,
    'future-jobs-career': futureJobsCareerPrompt,
    'decision-maker': decisionMakerPrompt,
    'website-builder': websiteBuilderPrompt,
    'image-maker': imageMakerPrompt,
    'kitchen-recipe': kitchenRecipePrompt,
    'search-engine': searchEnginePrompt,
    'conversational': getConversationalAgentPrompt
};

/**
 * Get the system prompt for a specific agent
 * Falls back to generic optimized prompt if agent not found
 */
export function getAgentPrompt(agentType: string, mode: 'quick' | 'normal' | 'thinking' = 'normal'): string {
    const prompt = AGENT_PROMPTS[agentType];

    if (!prompt) {
        // Fallback to generic prompt if agent type is unknown
        return getOptimizedPrompt();
    }

    // Handle dynamic prompts (functions) vs static prompts (strings)
    if (typeof prompt === 'function') {
        return prompt(mode);
    }

    return prompt;
}
