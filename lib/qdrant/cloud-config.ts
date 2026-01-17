// Qdrant Cloud Configuration
// Extended configuration for Qdrant Cloud with per-agent collections

import { getQdrantClient, QDRANT_CONFIG } from './client';

// Agent-specific collection names
export const AGENT_COLLECTIONS = {
    conversational: 'bandhannova_conversational',
    'study-learning': 'bandhannova_study',
    'future-jobs-career': 'bandhannova_career',
    'decision-maker': 'bandhannova_decisions',
    'website-builder': 'bandhannova_webdev',
    'search-engine': 'bandhannova_research',
} as const;

export type AgentType = keyof typeof AGENT_COLLECTIONS;

/**
 * Get collection name for a specific agent
 * @param agentType - Type of agent
 * @returns Collection name
 */
export function getAgentCollection(agentType: string): string {
    return AGENT_COLLECTIONS[agentType as AgentType] || QDRANT_CONFIG.collectionName;
}

/**
 * Initialize all agent collections in Qdrant Cloud
 */
export async function initializeAgentCollections(): Promise<void> {
    const client = getQdrantClient();

    try {
        const collections = await client.getCollections();
        const existingNames = collections.collections.map(c => c.name);

        // Create collections for each agent if they don't exist
        for (const [agentType, collectionName] of Object.entries(AGENT_COLLECTIONS)) {
            if (!existingNames.includes(collectionName)) {
                await client.createCollection(collectionName, {
                    vectors: {
                        size: QDRANT_CONFIG.vectorSize,
                        distance: QDRANT_CONFIG.distance,
                    },
                });
                console.log(`✅ Created collection: ${collectionName} for ${agentType}`);
            } else {
                console.log(`ℹ️  Collection already exists: ${collectionName}`);
            }
        }

        console.log('✅ All agent collections initialized');
    } catch (error) {
        console.error('❌ Error initializing agent collections:', error);
        throw error;
    }
}

/**
 * Check Qdrant Cloud connection and setup
 */
export async function verifyQdrantCloudSetup(): Promise<{
    connected: boolean;
    collections: number;
    error?: string;
}> {
    try {
        const client = getQdrantClient();
        const collections = await client.getCollections();

        return {
            connected: true,
            collections: collections.collections.length,
        };
    } catch (error: any) {
        return {
            connected: false,
            collections: 0,
            error: error.message,
        };
    }
}

/**
 * Get Qdrant Cloud configuration status
 */
export function getQdrantCloudConfig(): {
    url: string;
    hasApiKey: boolean;
    configured: boolean;
} {
    const url = process.env.NEXT_PUBLIC_QDRANT_URL || '';
    const apiKey = process.env.NEXT_PUBLIC_QDRANT_API_KEY || '';

    return {
        url,
        hasApiKey: !!apiKey,
        configured: !!url && !!apiKey,
    };
}
