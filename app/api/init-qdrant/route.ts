// Initialize Qdrant Collection API
// Creates the vector collection for memory storage

import { NextResponse } from 'next/server';
import { initializeCollection, checkQdrantHealth } from '@/lib/qdrant/client';

export async function GET() {
    try {
        // Check if Qdrant is healthy
        const isHealthy = await checkQdrantHealth();

        if (!isHealthy) {
            return NextResponse.json({
                success: false,
                error: 'Qdrant is not running or not accessible'
            }, { status: 503 });
        }

        // Initialize collection
        await initializeCollection();

        return NextResponse.json({
            success: true,
            message: 'Qdrant collection initialized successfully',
            collectionName: 'bandhannova_memories'
        });
    } catch (error) {
        console.error('Error initializing Qdrant:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}
