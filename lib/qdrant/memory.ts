// Qdrant Memory Management
// Store and retrieve conversation memories using vector embeddings

import { getQdrantClient, QDRANT_CONFIG } from './client';
import type { Message } from '../storage/localStorage';

export interface MemoryPoint {
    id: string;
    vector: number[];
    payload: {
        content: string;
        role: string;
        agentType: string;
        conversationId: string;
        userId: string;
        timestamp: number;
    };
}

/**
 * Generate embedding for text using Transformers.js
 * Free, local embeddings - no API needed!
 */
async function generateEmbedding(text: string): Promise<number[]> {
    try {
        // Import dynamically to avoid issues with SSR
        const { getEmbedding } = await import('../embeddings/transformers');
        return await getEmbedding(text);
    } catch (error) {
        console.error('Error generating embedding:', error);
        // Return zero vector as fallback
        return new Array(QDRANT_CONFIG.vectorSize).fill(0);
    }
}

/**
 * Store a message in Qdrant as a memory
 */
export async function storeMemory(
    message: Message,
    conversationId: string,
    userId: string
): Promise<void> {
    // Skip if Qdrant is not configured
    if (!process.env.NEXT_PUBLIC_QDRANT_URL) {
        console.log('Qdrant not configured, skipping memory storage');
        return;
    }

    try {
        const client = getQdrantClient();
        const embedding = await generateEmbedding(message.content);

        const point: MemoryPoint = {
            id: message.id,
            vector: embedding,
            payload: {
                content: message.content,
                role: message.role,
                agentType: message.agentType,
                conversationId,
                userId,
                timestamp: message.timestamp,
            },
        };

        await client.upsert(QDRANT_CONFIG.collectionName, {
            wait: true,
            points: [point],
        });
    } catch (error) {
        console.error('Error storing memory in Qdrant:', error);
        // Don't throw - allow app to continue without memory storage
    }
}

/**
 * Retrieve relevant memories based on query
 */
export async function getRelevantMemories(
    query: string,
    userId: string,
    limit: number = 5,
    agentType?: string
): Promise<string[]> {
    // Skip if Qdrant is not configured
    if (!process.env.NEXT_PUBLIC_QDRANT_URL) {
        return [];
    }

    try {
        const client = getQdrantClient();
        const queryEmbedding = await generateEmbedding(query);

        const filter: any = {
            must: [{ key: 'userId', match: { value: userId } }],
        };

        // Optionally filter by agent type
        if (agentType) {
            filter.must.push({ key: 'agentType', match: { value: agentType } });
        }

        const searchResult = await client.search(QDRANT_CONFIG.collectionName, {
            vector: queryEmbedding,
            filter,
            limit,
            with_payload: true,
        });

        // Extract content from results
        return searchResult.map((result) => {
            const payload = result.payload as MemoryPoint['payload'];
            return `[${new Date(payload.timestamp).toLocaleDateString()}] ${payload.content}`;
        });
    } catch (error) {
        console.error('Error retrieving memories from Qdrant:', error);
        return [];
    }
}

/**
 * Get conversation context from Qdrant
 */
export async function getConversationContext(
    conversationId: string,
    limit: number = 10
): Promise<string[]> {
    try {
        const client = getQdrantClient();

        const scrollResult = await client.scroll(QDRANT_CONFIG.collectionName, {
            filter: {
                must: [{ key: 'conversationId', match: { value: conversationId } }],
            },
            limit,
            with_payload: true,
        });

        return scrollResult.points.map((point) => {
            const payload = point.payload as MemoryPoint['payload'];
            return `${payload.role}: ${payload.content}`;
        });
    } catch (error) {
        console.error('Error getting conversation context:', error);
        return [];
    }
}

/**
 * Delete memories for a conversation
 */
export async function deleteConversationMemories(
    conversationId: string
): Promise<void> {
    try {
        const client = getQdrantClient();

        await client.delete(QDRANT_CONFIG.collectionName, {
            wait: true,
            filter: {
                must: [{ key: 'conversationId', match: { value: conversationId } }],
            },
        });
    } catch (error) {
        console.error('Error deleting conversation memories:', error);
    }
}

/**
 * Delete all memories for a user
 */
export async function deleteUserMemories(userId: string): Promise<void> {
    try {
        const client = getQdrantClient();

        await client.delete(QDRANT_CONFIG.collectionName, {
            wait: true,
            filter: {
                must: [{ key: 'userId', match: { value: userId } }],
            },
        });
    } catch (error) {
        console.error('Error deleting user memories:', error);
    }
}
