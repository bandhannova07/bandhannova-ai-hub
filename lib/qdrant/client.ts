// Qdrant Vector Database Client
// For semantic memory and context retrieval

import { QdrantClient } from '@qdrant/js-client-rest';

// Initialize Qdrant client
let qdrantClient: QdrantClient | null = null;

export function getQdrantClient(): QdrantClient {
    if (!qdrantClient) {
        const url = process.env.NEXT_PUBLIC_QDRANT_URL || 'http://localhost:6333';
        const apiKey = process.env.NEXT_PUBLIC_QDRANT_API_KEY;

        qdrantClient = new QdrantClient({
            url,
            apiKey,
        });
    }

    return qdrantClient;
}

// Collection configuration
export const QDRANT_CONFIG = {
    collectionName: 'bandhannova_memories',
    vectorSize: 384, // Transformers.js (all-MiniLM-L6-v2) embedding size
    distance: 'Cosine' as const,
};

// Initialize collection if it doesn't exist
export async function initializeCollection(): Promise<void> {
    const client = getQdrantClient();

    try {
        // Check if collection exists
        const collections = await client.getCollections();
        const exists = collections.collections.some(
            (c) => c.name === QDRANT_CONFIG.collectionName
        );

        if (!exists) {
            // Create collection
            await client.createCollection(QDRANT_CONFIG.collectionName, {
                vectors: {
                    size: QDRANT_CONFIG.vectorSize,
                    distance: QDRANT_CONFIG.distance,
                },
            });
            console.log('Qdrant collection created:', QDRANT_CONFIG.collectionName);
        }
    } catch (error) {
        console.error('Error initializing Qdrant collection:', error);
        // Don't throw - allow app to work without Qdrant
    }
}

// Health check
export async function checkQdrantHealth(): Promise<boolean> {
    try {
        const client = getQdrantClient();
        await client.getCollections();
        return true;
    } catch (error) {
        console.error('Qdrant health check failed:', error);
        return false;
    }
}
