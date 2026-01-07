/**
 * Prompts Index
 * Central export point for all prompt-related functions
 */

import { SYSTEM_PROMPT } from './system-prompt';

/**
 * Get agent-specific prompt
 * Currently using base system prompt for all agents
 */
export function getAgentPrompt(agentType: string): string {
    // Use base system prompt for all agents
    return SYSTEM_PROMPT;
}

/**
 * Export system prompt for direct use
 */
export { SYSTEM_PROMPT } from './system-prompt';
