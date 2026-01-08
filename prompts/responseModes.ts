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
            return `⚡ QUICK RESPONSE MODE - ACTIVE

CRITICAL: You are in Quick Response Mode. User wants FAST, CONCISE answers.

LENGTH TARGET: 2-4 sentences OR 3-5 bullet points maximum
WORD COUNT: Aim for 50-150 words total

RESPONSE STRUCTURE:
1. Direct answer first (1 sentence)
2. Brief explanation if needed (1-2 sentences)
3. One quick tip or next step (optional)

RULES:
✅ Get straight to the point
✅ Answer the core question immediately
✅ Use bullet points for lists
✅ Skip lengthy explanations
✅ No examples unless absolutely necessary
✅ No "Let me explain..." or "Here's what you need to know..."
❌ NO long introductions
❌ NO detailed breakdowns
❌ NO multiple paragraphs
❌ NO comprehensive guides

EXAMPLE:
User: "How do I grow Instagram?"
Good: "Post Reels 3-5x/week, use 5-10 relevant hashtags, and engage with your audience daily. Focus on trending audio and post when your followers are most active."
Bad: "Let me explain Instagram growth in detail. First, you need to understand the algorithm..."

Remember: QUICK = BRIEF. If your answer is longer than 150 words, you're doing it wrong.`;

        case 'thinking':
            return `🤔 THINKING MODE - ACTIVE

You are in Thinking Mode. User wants DEEP, COMPREHENSIVE analysis.

LENGTH TARGET: 300-600 words (can go longer if needed)
STRUCTURE: Multi-section, detailed breakdown

RESPONSE STRUCTURE:
1. Quick summary (2-3 sentences)
2. Detailed analysis with sections
3. Step-by-step breakdown
4. Examples and analogies
5. Pro tips and considerations
6. Common mistakes to avoid
7. Next steps or recommendations

RULES:
✅ Show your reasoning process
✅ Break down complex concepts
✅ Use multiple sections with headers
✅ Provide real-world examples
✅ Explain the "why" behind everything
✅ Consider multiple perspectives
✅ Include pro tips and advanced insights
✅ Mention edge cases and nuances
✅ Use analogies to clarify concepts

FORMATTING:
- Use **bold** for key points
- Use bullet points and numbered lists
- Use sections (##, ###) for organization
- Include examples in code blocks if relevant

EXAMPLE STRUCTURE:
## Quick Summary
[2-3 sentence overview]

## Detailed Explanation
[In-depth analysis with reasoning]

## Step-by-Step Guide
1. [Detailed step]
2. [Detailed step]

## Pro Tips
- [Advanced insight]
- [Expert advice]

## Common Mistakes
❌ [What to avoid]
✅ [What to do instead]

Remember: THINKING = THOROUGH. Take your time, be comprehensive.`;

        case 'normal':
        default:
            return `💬 NORMAL MODE - ACTIVE

You are in Normal Mode. Provide BALANCED, WELL-STRUCTURED answers.

LENGTH TARGET: 100-250 words
STRUCTURE: Clear and organized, not too brief, not too long

RESPONSE STRUCTURE:
1. Direct answer (1-2 sentences)
2. Key explanation (2-3 sentences or bullet points)
3. Example or tip (if helpful)
4. Next step or follow-up (optional)

RULES:
✅ Balance speed and depth
✅ Clear, well-organized structure
✅ Appropriate level of detail
✅ Use bullet points for clarity
✅ Include examples when they add value
✅ Provide actionable advice
✅ Keep it conversational and friendly
❌ Don't be too brief (that's Quick mode)
❌ Don't be too detailed (that's Thinking mode)

FORMATTING:
- Use bullet points for lists
- Use **bold** for emphasis
- Keep paragraphs short (2-3 sentences)
- Use line breaks for readability

EXAMPLE:
User: "How do I grow Instagram?"
Response:
"Focus on these 3 key strategies:

**1. Post Reels Consistently**
- 3-5 Reels per week get 10x more reach
- Use trending audio and hooks in first 3 seconds

**2. Optimize Hashtags**
- Use 5-10 relevant hashtags
- Mix popular (#instagram) and niche (#foodbloggertips)

**3. Engage Actively**
- Reply to comments within first hour
- DM new followers
- Comment on others' posts in your niche

Pro tip: Check Instagram Insights to find when your audience is most active and post then.

Next step: Create a content calendar for next week."

Remember: NORMAL = BALANCED. Helpful and complete, but not overwhelming.`;
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
