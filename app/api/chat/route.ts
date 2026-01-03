// Chat API Endpoint with Streaming - Using OpenRouter
// Handles AI chat requests with prompt combination and streaming responses

import { NextRequest } from 'next/server';
import { buildMessagesArray } from '@/lib/ai/promptCombiner';
import { getRelevantMemories } from '@/lib/qdrant/memory';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const {
            message,
            agentType,
            responseMode,
            model,
            conversationHistory,
            userId,
        } = await req.json();

        // Validation
        if (!message || !agentType || !responseMode) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Get relevant memories from Qdrant
        const memories = await getRelevantMemories(
            message,
            userId || 'anonymous',
            5,
            agentType
        );

        // Build complete messages array with prompts
        const messages = buildMessagesArray(
            agentType,
            responseMode as 'quick' | 'normal' | 'thinking',
            message,
            conversationHistory || [],
            { memories }
        );

        // Determine which AI model to use based on agent type
        const aiModel = getModelName(model, agentType);

        // Call OpenRouter API with streaming
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://bandhannova.com',
                'X-Title': 'BandhanNova AI Hub',
            },
            body: JSON.stringify({
                model: aiModel,
                messages,
                stream: true,
                temperature: getTemperature(responseMode),
                max_tokens: getMaxTokens(responseMode),
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenRouter API error:', error);
            throw new Error('OpenRouter API request failed');
        }

        // Return streaming response
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Helper: Map model and agent to actual OpenRouter model with fallback
function getModelName(model: string, agentType?: string): string {
    // Agent-specific model mapping with fallbacks
    const agentModels: Record<string, { primary: string; fallback?: string }> = {
        'conversational': {
            primary: 'xiaomi/mimo-v2-flash:free',
            fallback: 'tngtech/deepseek-r1t2-chimera:free'
        },
        'search-engine': { // Research & Discovery
            primary: 'google/gemini-2.0-flash-exp:free',
            fallback: 'alibaba/tongyi-deepresearch-30b-a3b:free'
        },
        'creator-social': { // Creator & Social Media
            primary: 'tngtech/deepseek-r1t2-chimera:free',
            fallback: 'tngtech/deepseek-r1t-chimera:free'
        },
        'creative-productivity': {
            primary: 'meta-llama/llama-3.3-70b-instruct:free',
            fallback: 'allenai/olmo-3.1-32b-think:free'
        },
        'psychology-personality': {
            primary: 'xiaomi/mimo-v2-flash:free',
            fallback: 'xiaomi/mimo-v2-flash:free'
        },
        'study-planner': {
            primary: 'xiaomi/mimo-v2-flash:free',
            fallback: 'mistralai/devstral-2512:free'
        },
        'business-career': {
            primary: 'meta-llama/llama-3.1-405b-instruct:free',
            fallback: 'mistralai/devstral-2512:free'
        },
        'image-maker': {
            primary: 'sourceful/riverflow-v2-fast-preview',
            fallback: 'bytedance-seed/seedream-4.5'
        },
        'kitchen-recipe': {
            primary: 'mistralai/devstral-2512:free',
            fallback: 'google/gemini-2.0-flash-exp:free'
        }
    };

    // Model selection override mapping
    const modelOverrides: Record<string, string> = {
        'ispat-v2-ultra': 'xiaomi/mimo-v2-flash:free',
        'ispat-v2-pro': 'meta-llama/llama-3.3-70b-instruct:free',
        'ispat-v2-lite': 'xiaomi/mimo-v2-flash:free',
        'barud2-fast': 'google/gemini-2.0-flash-exp:free',
        'barud2-pro': 'meta-llama/llama-3.1-405b-instruct:free',
    };

    // If specific model is selected, use override
    if (model !== 'auto' && modelOverrides[model]) {
        return modelOverrides[model];
    }

    // Use agent-specific model
    if (agentType && agentModels[agentType]) {
        return agentModels[agentType].primary;
    }

    // Default fallback
    return 'xiaomi/mimo-v2-flash:free';
}

// Helper: Get temperature based on response mode
function getTemperature(responseMode: string): number {
    const temperatureMap: Record<string, number> = {
        'quick': 0.3,      // More focused, less creative
        'normal': 0.7,     // Balanced
        'thinking': 0.5,   // Thoughtful but not too creative
    };

    return temperatureMap[responseMode] || 0.7;
}

// Helper: Get max tokens based on response mode
function getMaxTokens(responseMode: string): number {
    const tokensMap: Record<string, number> = {
        'quick': 500,      // Short responses
        'normal': 1500,    // Medium responses
        'thinking': 3000,  // Long, detailed responses
    };

    return tokensMap[responseMode] || 1500;
}
