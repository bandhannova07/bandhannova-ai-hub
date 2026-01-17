// Initialize Qdrant Cloud Collections
// Run this script once to setup all agent collections

import { initializeAgentCollections, verifyQdrantCloudSetup } from '@/lib/qdrant/cloud-config';

export async function GET() {
    try {
        console.log('🚀 Starting Qdrant Cloud initialization...');

        // Step 1: Verify connection
        console.log('📡 Verifying Qdrant Cloud connection...');
        const status = await verifyQdrantCloudSetup();

        if (!status.connected) {
            return Response.json({
                success: false,
                error: 'Failed to connect to Qdrant Cloud',
                details: status.error,
                message: 'Please check your NEXT_PUBLIC_QDRANT_URL and NEXT_PUBLIC_QDRANT_API_KEY',
            }, { status: 500 });
        }

        console.log('✅ Connected to Qdrant Cloud');
        console.log(`📊 Existing collections: ${status.collections}`);

        // Step 2: Initialize all agent collections
        console.log('🔧 Initializing agent collections...');
        await initializeAgentCollections();

        // Step 3: Verify again
        const finalStatus = await verifyQdrantCloudSetup();

        return Response.json({
            success: true,
            message: 'Qdrant Cloud initialized successfully',
            collections: finalStatus.collections,
            details: {
                url: process.env.NEXT_PUBLIC_QDRANT_URL,
                hasApiKey: !!process.env.NEXT_PUBLIC_QDRANT_API_KEY,
            },
        });
    } catch (error: any) {
        console.error('❌ Qdrant initialization failed:', error);

        return Response.json({
            success: false,
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
