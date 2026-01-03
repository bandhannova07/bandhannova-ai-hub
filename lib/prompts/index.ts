// Agent Prompts Index
// Centralized export for all AI agent prompts

import CONVERSATIONAL_PROMPT from './conversational';
import RESEARCH_PROMPT from './research';
import CREATIVE_PROMPT from './creative';
import PSYCHOLOGY_PROMPT from './psychology';
import STUDY_PROMPT from './study';
import BUSINESS_PROMPT from './business';
import WEBSITE_PROMPT from './website';
import IMAGE_PROMPT from './image';
import KITCHEN_PROMPT from './kitchen';

export const AGENT_PROMPTS: Record<string, string> = {
    'conversational': CONVERSATIONAL_PROMPT,
    'search-engine': RESEARCH_PROMPT, // Research & Discovery AI
    'creative-productivity': CREATIVE_PROMPT,
    'psychology-personality': PSYCHOLOGY_PROMPT,
    'study-planner': STUDY_PROMPT,
    'business-career': BUSINESS_PROMPT,
    'website-builder': WEBSITE_PROMPT,
    'image-maker': IMAGE_PROMPT,
    'kitchen-recipe': KITCHEN_PROMPT,
};

export function getAgentPrompt(agentType: string): string {
    return AGENT_PROMPTS[agentType] || AGENT_PROMPTS['conversational'];
}

export {
    CONVERSATIONAL_PROMPT,
    RESEARCH_PROMPT,
    CREATIVE_PROMPT,
    PSYCHOLOGY_PROMPT,
    STUDY_PROMPT,
    BUSINESS_PROMPT,
    WEBSITE_PROMPT,
    IMAGE_PROMPT,
    KITCHEN_PROMPT,
};
