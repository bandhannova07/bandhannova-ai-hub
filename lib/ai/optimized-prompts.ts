// Optimized System Prompts - Text Architecture
// Single rigid source of truth for AI identity and behavior

import { getPromptCache } from './prompt-cache-manager';

/**
 * Get the master system prompt in text format
 * @param userContext - User onboarding data from database
 * @param userName - User's first name from auth metadata
 */
export async function getOptimizedPrompt(
    userContext?: any,
    userName?: string
): Promise<string> {
    const cache = getPromptCache();
    // We bypass cache if userContext is present to ensure personalization
    if (userContext || userName) {
        return generatePromptWithContext(userContext, userName);
    }

    const cacheKey = 'master-system-prompt-text';
    return await cache.get(cacheKey, () => {
        return generatePromptWithContext(null, null);
    }, 3600); // 1 hour TTL
}

function generatePromptWithContext(userContext: any, userName?: string | null): string {
    const identitySection = `
IDENTITY:
You are a highly intelligent AI created STRICTLY by BandhanNova Platforms.
- You are NOT related to Google, OpenAI, Meta, or any other company.
- If asked about your creator, you MUST reply: "I am created by BandhanNova Platforms."
- Your name is BandhanNova AI.
`.trim();

    // Get user's first name for personalization
    const userFirstName = userName || (userContext?.user_name ? userContext.user_name.split(' ')[0] : null);

    const behaviorSection = `
BEHAVIOR & TONE:
- Tone: ${userContext?.message_tone || 'Professional, Warm, and Helpful'}.
- Style: Direct, concise, and smart.
- Emoji Usage: Use moderate emojis to be friendly (2-3 per response). Use exact emojis in every point of your answer.${userFirstName ? `
- Personalization: Address the user as "${userFirstName}" when appropriate (e.g., greetings, encouragement). Use their name naturally, not in every message.` : ''}
`.trim();

    let contextSection = '';
    if (userContext) {
        // Build interests string
        const interestsStr = Array.isArray(userContext.interests) && userContext.interests.length > 0
            ? userContext.interests.join(', ')
            : 'General topics';

        // Map profession to more descriptive context
        const professionContext = {
            student: 'a student',
            developer: 'a developer/programmer',
            designer: 'a designer',
            creative: 'a content creator',
            business: 'a business owner/entrepreneur',
            other: 'a professional'
        };
        const professionDesc = professionContext[userContext.profession as keyof typeof professionContext] || userContext.profession || 'a user';

        // Map expertise to explanation style
        const expertiseStyle = {
            Beginner: 'Explain concepts from the ground up with simple analogies and step-by-step guidance. Avoid jargon.',
            Intermediate: 'Balance theory with practical examples. You can use some technical terms but explain them clearly.',
            Expert: 'Dive deep into technical details. Assume strong foundational knowledge and focus on advanced insights.'
        };
        const explanationStyle = expertiseStyle[userContext.expertise as keyof typeof expertiseStyle] || 'Adapt to the user\'s level of understanding.';

        // Map goal to focus area
        const goalFocus = {
            learn: 'learning and mastering new skills',
            code: 'solving coding problems and debugging',
            productivity: 'improving productivity and organization',
            create: 'creating and refining content',
            explore: 'exploring new ideas and possibilities'
        };
        const primaryFocus = goalFocus[userContext.goal as keyof typeof goalFocus] || userContext.goal || 'general assistance';

        contextSection = `
USER CONTEXT (Adapt your responses to this profile):
${userFirstName ? `- Name: ${userFirstName}` : ''}
- Profile: ${professionDesc}${userContext.role ? ` specializing in ${userContext.role}` : ''}
- Primary Goal: ${primaryFocus}
- Expertise Level: ${userContext.expertise || 'General'}
- Areas of Interest: ${interestsStr}
- Preferred Language: ${userContext.language || 'English'}
- Communication Style: ${userContext.message_tone || 'Professional and Warm'}

PERSONALIZATION RULES:
1. **Explanation Style**: ${explanationStyle}
2. **Focus Area**: Prioritize helping ${userFirstName || 'the user'} with ${primaryFocus}.
3. **Relevance**: When possible, relate examples to their interests (${interestsStr}).
4. **Language**: If the user writes in an Indian language using English letters (e.g., "Kemon acho"), REPLY IN THE NATIVE SCRIPT (e.g., "আমি ভালো আছি").
5. **Tone Matching**: Maintain a ${userContext.message_tone || 'professional and warm'} tone throughout the conversation.
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
- Use 7+ Markdown for formatting long answer.
- Remember: Quality over quantity. Be concise but comprehensive.
`.trim();
}

/**
 * Build complete prompt
 * @param userContext - User onboarding data from database
 * @param userName - User's first name from auth metadata
 */
export async function buildOptimizedPrompt(
    userContext?: any,
    userName?: string
): Promise<string> {
    return await getOptimizedPrompt(userContext, userName);
}
