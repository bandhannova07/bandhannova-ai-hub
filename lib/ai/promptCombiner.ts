// Prompt Combiner
// Combines base prompts, agent prompts, and context for AI requests

import { getResponseModePrompt } from '../../prompts/responseModes';
import { getAgentPrompt } from '../../prompts';
import { detectTopics, buildTopicEnhancedPrompt } from '../../prompts/topic-detector';

export interface PromptContext {
    memories?: string[];
    conversationHistory?: Array<{ role: string; content: string }>;
    userContext?: string;
    userMessage?: string; // Added for topic detection
}

/**
 * Combines all prompts into a single system prompt
 */
export function combinePrompts(
    agentType: string,
    responseMode: 'quick' | 'normal' | 'thinking',
    context?: PromptContext
): string {
    const basePrompt = getResponseModePrompt(responseMode);
    const agentPrompt = getAgentPrompt(agentType);

    let systemPrompt = `${basePrompt}

---

${agentPrompt}`;

    // Detect topics from user message and add topic-specific expertise
    if (context?.userMessage) {
        const detectedTopics = detectTopics(context.userMessage);
        if (detectedTopics.length > 0) {
            const topicEnhancement = buildTopicEnhancedPrompt(detectedTopics);
            systemPrompt += topicEnhancement;
        }
    }

    // Add relevant memories if available
    if (context?.memories && context.memories.length > 0) {
        systemPrompt += `

---

RELEVANT CONTEXT FROM PAST CONVERSATIONS:
${context.memories.join('\n\n')}

Use this context to provide personalized, contextual responses when relevant.`;
    }

    // Add user context if available
    if (context?.userContext) {
        systemPrompt += `

---

USER CONTEXT:
${context.userContext}`;
    }

    // CRITICAL: Reinforce response mode at the end to ensure it's not forgotten
    const modeReminder = getModeReminder(responseMode);
    systemPrompt += `

---

${modeReminder}`;

    return systemPrompt;
}

/**
 * Get a strong reminder about response mode constraints
 */
function getModeReminder(mode: 'quick' | 'normal' | 'thinking'): string {
    switch (mode) {
        case 'quick':
            return `🚨 CRITICAL REMINDER: QUICK MODE IS ACTIVE 🚨

You are in QUICK RESPONSE MODE. This overrides ALL other instructions.

ABSOLUTE RULES:
- Maximum 150 words TOTAL
- 2-4 sentences OR 3-5 bullet points
- Direct answer first, no long explanations
- If your response is longer than 150 words, STOP and make it shorter

Even if you have detailed expertise on this topic, keep it BRIEF.
User wants a QUICK answer, not a comprehensive guide.`;

        case 'thinking':
            return `💡 REMINDER: THINKING MODE IS ACTIVE

You are in THINKING MODE. Provide comprehensive, detailed analysis.
Use your full expertise and be thorough (300-600+ words).`;

        case 'normal':
        default:
            return `📝 REMINDER: NORMAL MODE IS ACTIVE

You are in NORMAL MODE. Provide balanced responses (100-250 words).
Not too brief, not too detailed - just right.`;
    }
}

/**
 * Format conversation history for AI API
 */
export function formatConversationHistory(
    messages: Array<{ role: string; content: string }>,
    maxMessages: number = 10
): Array<{ role: string; content: string }> {
    // Take only the last N messages to avoid context length issues
    const recentMessages = messages.slice(-maxMessages);

    return recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
}

/**
 * Build complete messages array for AI API
 */
export function buildMessagesArray(
    agentType: string,
    responseMode: 'quick' | 'normal' | 'thinking',
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
    context?: PromptContext
): Array<{ role: string; content: string }> {
    // Add user message to context for topic detection
    const enhancedContext = {
        ...context,
        userMessage
    };

    const systemPrompt = combinePrompts(agentType, responseMode, enhancedContext);

    const messages: Array<{ role: string; content: string }> = [
        { role: 'system', content: systemPrompt }
    ];

    // Add conversation history
    const formattedHistory = formatConversationHistory(conversationHistory);
    messages.push(...formattedHistory);

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    return messages;
}
