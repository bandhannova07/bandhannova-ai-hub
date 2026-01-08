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

    return systemPrompt;
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
