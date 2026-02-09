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

type AgentPromptMap = Record<string, string | ((mode: any, userContext?: any) => string | object)>;

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
 * @param agentType - The type of agent to get the prompt for
 * @param mode - The response mode (quick, normal, thinking)
 * @param userContext - User onboarding data from database
 * @param userName - User's first name from auth metadata
 */
export async function getAgentPrompt(
    agentType: string,
    mode: 'quick' | 'normal' | 'thinking' = 'normal',
    userContext?: any,
    userName?: string
): Promise<string> {
    // 1. Get the rigid Master Prompt (Identity, Tone, Language Rules)
    const masterPrompt = await getOptimizedPrompt(userContext, userName);

    const agentPromptFunc = AGENT_PROMPTS[agentType];

    if (!agentPromptFunc) {
        return masterPrompt;
    }

    // 2. Get Agent-Specific Instructions
    let agentInstructions = "";
    if (typeof agentPromptFunc === 'function') {
        const result = agentPromptFunc(mode, userContext);
        agentInstructions = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
    } else {
        agentInstructions = agentPromptFunc as string;
    }

    // 3. Combine them
    return `${masterPrompt}

---
SPECIALIZED AGENT ROLE:
${agentInstructions}`;
}
