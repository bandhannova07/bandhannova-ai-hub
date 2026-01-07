/**
 * Prompts Index
 * Central export point for all prompt-related functions
 */

import { SYSTEM_PROMPT } from './system-prompt';
import IMAGE_MAKER_PROMPT from './agents/image-maker';
import CONVERSATIONAL_PROMPT from './agents/conversational';

/**
 * Get agent-specific prompt
 * For image-maker, use simple prompt
 * For conversational, use advanced conversational prompt
 * For others, use base system prompt
 */
export function getAgentPrompt(agentType: string): string {
    // Image-maker uses simplified prompt
    if (agentType === 'image-maker') {
        return IMAGE_MAKER_PROMPT;
    }

    // Conversational uses advanced conversational prompt
    if (agentType === 'conversational') {
        return CONVERSATIONAL_PROMPT;
    }

    // Base system prompt for all other agents
    // Individual agent prompts can be added here later
    return SYSTEM_PROMPT;
}

/**
 * Export system prompt for direct use
 */
export { SYSTEM_PROMPT } from './system-prompt';
