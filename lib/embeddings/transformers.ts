// Text Embeddings using Transformers.js
// Free, local embeddings - no API needed!

// Singleton pattern for model loading
let embedder: any = null;
let isLoading = false;
let loadingPromise: Promise<any> | null = null;

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

/**
 * Initialize the embedding model
 * Model: Xenova/all-MiniLM-L6-v2 (384 dimensions)
 * - Fast and efficient
 * - Good quality for semantic search
 * - Works in browser and Node.js
 */
async function initializeEmbedder() {
    if (embedder) {
        return embedder;
    }

    if (isLoading && loadingPromise) {
        return loadingPromise;
    }

    isLoading = true;
    loadingPromise = (async () => {
        try {
            // Dynamic import to avoid SSR issues
            const { pipeline, env } = await import('@xenova/transformers');

            // Configure Transformers.js
            env.allowLocalModels = false;

            const model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            embedder = model;
            isLoading = false;
            console.log('✅ Embedding model loaded successfully');
            return model;
        } catch (error) {
            isLoading = false;
            loadingPromise = null;
            console.error('❌ Failed to load embedding model:', error);
            throw error;
        }
    })();

    return loadingPromise;
}

/**
 * Generate embeddings for a single text
 * @param text - Text to embed
 * @returns Array of numbers (384 dimensions)
 */
export async function getEmbedding(text: string): Promise<number[]> {
    // Skip if not in browser (SSR)
    if (!isBrowser()) {
        console.warn('⚠️ Embeddings only work in browser, returning zero vector');
        return new Array(384).fill(0);
    }

    try {
        const model = await initializeEmbedder();

        // Generate embeddings with mean pooling and normalization
        const output = await model(text, {
            pooling: 'mean',
            normalize: true,
        });

        // Convert tensor to array
        const embeddings = Array.from(output.data);

        return embeddings as number[];
    } catch (error) {
        console.error('Error generating embedding:', error);
        // Return zero vector as fallback
        return new Array(384).fill(0);
    }
}

/**
 * Generate embeddings for multiple texts (batch processing)
 * @param texts - Array of texts to embed
 * @returns Array of embedding arrays
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
    // Skip if not in browser (SSR)
    if (!isBrowser()) {
        console.warn('⚠️ Embeddings only work in browser, returning zero vectors');
        return texts.map(() => new Array(384).fill(0));
    }

    try {
        const model = await initializeEmbedder();

        // Process all texts
        const embeddings = await Promise.all(
            texts.map(async (text) => {
                const output = await model(text, {
                    pooling: 'mean',
                    normalize: true,
                });
                return Array.from(output.data) as number[];
            })
        );

        return embeddings;
    } catch (error) {
        console.error('Error generating embeddings:', error);
        return texts.map(() => new Array(384).fill(0));
    }
}

/**
 * Get embedding dimensions
 * @returns Number of dimensions (384 for all-MiniLM-L6-v2)
 */
export function getEmbeddingDimensions(): number {
    return 384;
}

/**
 * Preload the model (optional, for better UX)
 * Call this on app initialization
 */
export async function preloadEmbeddingModel(): Promise<void> {
    if (!isBrowser()) {
        return;
    }

    try {
        console.log('🔄 Preloading embedding model...');
        await initializeEmbedder();
        console.log('✅ Embedding model preloaded');
    } catch (error) {
        console.error('❌ Failed to preload embedding model:', error);
    }
}

/**
 * Calculate cosine similarity between two embeddings
 * @param embedding1 - First embedding
 * @param embedding2 - Second embedding
 * @returns Similarity score (0 to 1)
 */
export function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
        throw new Error('Embeddings must have the same dimensions');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
        norm1 += embedding1[i] * embedding1[i];
        norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}
