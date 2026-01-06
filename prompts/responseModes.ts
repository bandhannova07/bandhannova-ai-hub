/**
 * Response Mode Prompts
 * Different response modes for AI behavior
 */

/**
 * Get prompt based on response mode
 */
export function getResponseModePrompt(mode: 'quick' | 'normal' | 'thinking'): string {
    switch (mode) {
        case 'quick':
            return `⚡ QUICK RESPONSE MODE

You are in Quick Response Mode. Provide:
- Fast, concise answers
- Direct and to the point
- No unnecessary elaboration
- Focus on the core question
- Use bullet points when appropriate

Keep responses brief but complete.`;

        case 'thinking':
            return `🤔 THINKING MODE

You are in Thinking Mode. Provide:
- Deep analysis and reasoning
- Step-by-step breakdown
- Show your thought process
- Consider multiple angles
- Explain the "why" behind answers
- Use examples and analogies
- Be thorough and comprehensive

Take your time to think through complex problems.`;

        case 'normal':
        default:
            return `💬 NORMAL MODE

You are in Normal Mode. Provide:
- Balanced depth and speed
- Clear, well-structured answers
- Appropriate level of detail
- Examples when helpful
- Comprehensive but efficient

This is the default, balanced mode.`;
    }
}

/**
 * Get response mode description for UI
 */
export function getResponseModeDescription(mode: 'quick' | 'normal' | 'thinking'): string {
    switch (mode) {
        case 'quick':
            return 'Fast, concise answers';
        case 'thinking':
            return 'Deep analysis with reasoning';
        case 'normal':
        default:
            return 'Balanced responses';
    }
}
