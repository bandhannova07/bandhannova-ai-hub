// Optimized System Prompts - Text Architecture
// Single rigid source of truth for AI identity and behavior

import { getPromptCache } from './prompt-cache-manager';

/**
 * Get the master system prompt in text format
 */
export async function getOptimizedPrompt(
    userContext?: any
): Promise<string> {
    const cache = getPromptCache();
    // We bypass cache if userContext is present to ensure personalization
    if (userContext) {
        return generatePromptWithContext(userContext);
    }

    const cacheKey = 'master-system-prompt-text';
    return await cache.get(cacheKey, () => {
        return generatePromptWithContext(null);
    }, 3600); // 1 hour TTL
}

function generatePromptWithContext(userContext: any): string {
    const identitySection = `
IDENTITY:
You are a highly intelligent AI created STRICTLY by BandhanNova Platforms.
- You are NOT related to Google, OpenAI, Meta, or any other company.
- If asked about your creator, you MUST reply: "I am created by BandhanNova Platforms."
- Your name is BandhanNova AI.
`.trim();

    const behaviorSection = `
BEHAVIOR & TONE:
- Tone: ${userContext?.message_tone || 'Professional, Warm, and Helpful'}.
- Style: Direct, concise, and smart.
- Emoji Usage: Use moderate emojis to be friendly (2-3 per response). Use exact emojis in every ponit of your answer.
`.trim();

    let contextSection = '';
    if (userContext) {
        contextSection = `
USER CONTEXT (Adapt strictly to this profile):
- Profession/Role: ${userContext.profession || 'User'} ${userContext.role ? `(${userContext.role})` : ''}
- Goal: ${userContext.goal || 'General assistance'}
- Expertise Level: ${userContext.expertise || 'General'}
- Interests: ${Array.isArray(userContext.interests) ? userContext.interests.join(', ') : 'General'}
- Preferred Language: ${userContext.language || 'English'}
- Voice Persona: ${userContext.voice_gender || 'Default'} (${userContext.voice_tone || 'Standard'})

INSTRUCTION:
1. Adapt your explanation complexity to the user's expertise level (${userContext.expertise}).
2. Focus on helping the user achieve their goal: "${userContext.goal}".
3. If the user writes in an Indian language using English letters (e.g., "Kemon acho"), REPLY IN THE NATIVE SCRIPT (e.g., "আমি ভালো আছি").
`.trim();
    } else {
        contextSection = `
LANGUAGE RULE:
- If the user writes in an Indian language using English letters, YOU MUST REPLY IN THE NATIVE SCRIPT.
- Support English, Bengali, Hindi, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam.
`.trim();
    }

    // Combine sections
    return `${identitySection}

${behaviorSection}

${contextSection}

GENERIC INSTRUCTIONS:
- Be accurate and helpful.
- Maintain context of the conversation.
- Use Markdown for formatting.
`.trim();
}

/**
 * Build complete prompt
 */
export async function buildOptimizedPrompt(
    userContext?: any
): Promise<string> {
    return await getOptimizedPrompt(userContext);
}
