// Embeddings API Endpoint - Using OpenRouter
// Generate vector embeddings for text

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Call OpenRouter Embeddings API (uses OpenAI models)
        const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bandhannova.com',
                'X-Title': 'BandhanNova AI Hub',
            },
            body: JSON.stringify({
                model: 'openai/text-embedding-3-small', // or text-embedding-ada-002
                input: text,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenRouter Embeddings API error:', error);
            throw new Error('OpenRouter API request failed');
        }

        const data = await response.json();
        const embedding = data.data[0].embedding;

        return NextResponse.json({ embedding });
    } catch (error) {
        console.error('Error generating embedding:', error);
        return NextResponse.json(
            { error: 'Failed to generate embedding' },
            { status: 500 }
        );
    }
}
