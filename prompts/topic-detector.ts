/**
 * Topic Detector
 * Analyzes user messages to detect relevant topics and load appropriate prompts
 */

import creatorSocialTopic from './topics/creator-social.json';

// Topic interface
interface TopicPrompt {
    topic: string;
    displayName: string;
    description: string;
    keywords: string[];
    expertise: {
        role: string;
        description: string;
        knowledgeAreas: string[];
        capabilities: string[];
    };
    responseStyle: {
        tone: string;
        personality: string;
        structure: string;
        includeExamples: boolean;
        includeStats: boolean;
        includeProTips: boolean;
        visualDescriptions: boolean;
    };
    responseGuidelines: any;
    specialInstructions: string[];
    [key: string]: any;
}

// Available topics
const TOPICS: Record<string, TopicPrompt> = {
    'creator-social': creatorSocialTopic as TopicPrompt,
    // More topics will be added here
};

/**
 * Detect topics from user message
 */
export function detectTopics(message: string): string[] {
    const lowercaseMessage = message.toLowerCase();
    const detectedTopics: string[] = [];

    // Check each topic's keywords
    for (const [topicKey, topic] of Object.entries(TOPICS)) {
        const keywordMatches = topic.keywords.filter(keyword =>
            lowercaseMessage.includes(keyword.toLowerCase())
        );

        // If at least 2 keywords match, consider it a topic match
        if (keywordMatches.length >= 2) {
            detectedTopics.push(topicKey);
        }
    }

    return detectedTopics;
}

/**
 * Get topic prompt by key
 */
export function getTopicPrompt(topicKey: string): TopicPrompt | null {
    return TOPICS[topicKey] || null;
}

/**
 * Build enhanced prompt with topic expertise
 */
export function buildTopicEnhancedPrompt(detectedTopics: string[]): string {
    if (detectedTopics.length === 0) {
        return ''; // No topic-specific enhancement
    }

    let enhancedPrompt = '\n\n# TOPIC-SPECIFIC EXPERTISE\n\n';

    for (const topicKey of detectedTopics) {
        const topic = getTopicPrompt(topicKey);
        if (!topic) continue;

        enhancedPrompt += `## ${topic.displayName}\n\n`;
        enhancedPrompt += `**Your Role:** ${topic.expertise.role}\n\n`;
        enhancedPrompt += `${topic.expertise.description}\n\n`;

        // Add knowledge areas
        enhancedPrompt += `**Knowledge Areas:**\n`;
        topic.expertise.knowledgeAreas.slice(0, 8).forEach(area => {
            enhancedPrompt += `- ${area}\n`;
        });
        enhancedPrompt += `\n`;

        // Add response style
        enhancedPrompt += `**Response Style:**\n`;
        enhancedPrompt += `- Tone: ${topic.responseStyle.tone}\n`;
        enhancedPrompt += `- Personality: ${topic.responseStyle.personality}\n`;
        enhancedPrompt += `- Structure: ${topic.responseStyle.structure}\n`;
        if (topic.responseStyle.includeProTips) {
            enhancedPrompt += `- Include pro tips and insider advice\n`;
        }
        if (topic.responseStyle.includeExamples) {
            enhancedPrompt += `- Provide real-world examples\n`;
        }
        enhancedPrompt += `\n`;

        // Add special instructions
        if (topic.specialInstructions && topic.specialInstructions.length > 0) {
            enhancedPrompt += `**Special Instructions:**\n`;
            topic.specialInstructions.slice(0, 5).forEach(instruction => {
                enhancedPrompt += `- ${instruction}\n`;
            });
            enhancedPrompt += `\n`;
        }
    }

    return enhancedPrompt;
}

/**
 * Get all available topics
 */
export function getAllTopics(): Record<string, TopicPrompt> {
    return TOPICS;
}

export default {
    detectTopics,
    getTopicPrompt,
    buildTopicEnhancedPrompt,
    getAllTopics
};
