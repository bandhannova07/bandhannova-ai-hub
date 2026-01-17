// Chat API Endpoint with Streaming
// Uses optimized prompts for 6x faster Time To First Token

import { NextRequest } from 'next/server';
import { buildOptimizedPrompt } from '@/lib/ai/optimized-prompts';
import { AIMode, getModelChain, getTimeout } from '@/lib/ai/models/config';
import { detectLanguage, getLanguageInstruction } from '@/lib/ai/language-detection';
import { getUserLanguage, storeUserLanguage } from '@/lib/qdrant/memory';

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

        // Validate mode
        const mode = responseMode as AIMode;
        if (!['quick', 'normal', 'thinking'].includes(mode)) {
            return new Response(
                JSON.stringify({ error: 'Invalid mode' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 🌍 Language Preference System
        let userLanguage: string | null = null;

        // Try to get user's saved language preference
        if (userId) {
            userLanguage = await getUserLanguage(userId);
        }

        // If no saved preference, detect from current message
        if (!userLanguage) {
            userLanguage = detectLanguage(message);

            // Save for future use (only on first message)
            if (userId && (!conversationHistory || conversationHistory.length === 0)) {
                await storeUserLanguage(userId, userLanguage);
                console.log(`🌍 First message detected: ${userLanguage}`);
            }
        }

        // Build optimized prompt (cached, 200-600 tokens instead of 3000+!)
        let systemPrompt = buildOptimizedPrompt(mode, message);

        // Add language instruction if not English
        if (userLanguage && userLanguage !== 'en') {
            const languageInstruction = getLanguageInstruction(userLanguage);
            systemPrompt = `${systemPrompt}\n\n${languageInstruction}`;
        }

        // Build messages array
        const messages: Array<{ role: string; content: string }> = [
            { role: 'system', content: systemPrompt }
        ];

        // Add conversation history (last 10 messages only)
        if (conversationHistory && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-10);
            messages.push(...recentHistory);
        }

        // Add current user message
        messages.push({ role: 'user', content: message });

        // Get model chain and timeout for this mode
        const models = getModelChain(mode);
        const timeout = getTimeout(mode);

        // Create streaming model caller
        const streamingModelCaller = async (
            modelName: string,
            prompt: string,
            timeoutMs: number
        ): Promise<ReadableStream> => {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://www.bandhannova.in',
                    'X-Title': 'BandhanNova AI Hub',
                },
                body: JSON.stringify({
                    model: modelName,
                    messages,
                    stream: true,
                    temperature: getTemperature(mode),
                    max_tokens: getMaxTokens(mode),
                }),
                signal: AbortSignal.timeout(timeoutMs),
            });

            if (!response.ok) {
                throw new Error(`Model ${modelName} failed: ${response.statusText}`);
            }

            return response.body!;
        };

        // Execute with fallback chain
        let currentModelIndex = 0;
        let lastError: Error | null = null;

        // Try each model in the chain
        for (let i = 0; i < models.length; i++) {
            const modelName = models[i];
            currentModelIndex = i;

            try {
                const stream = await streamingModelCaller(modelName, message, timeout);

                // Return streaming response
                return new Response(stream, {
                    headers: {
                        'Content-Type': 'text/event-stream; charset=utf-8',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'X-Model-Used': modelName,
                        'X-Attempt': String(i + 1),
                    },
                });
            } catch (error: any) {
                lastError = error;
                console.error(`[API] Model ${modelName} failed (attempt ${i + 1}):`, error.message);

                // If this was the last model, throw error
                if (i === models.length - 1) {
                    break;
                }

                // Otherwise, continue to next model
                console.log(`[API] Trying next model in fallback chain...`);
            }
        }

        // All models failed
        throw new Error(
            `All models failed after ${models.length} attempts. Last error: ${lastError?.message || 'Unknown'}`
        );

    } catch (error) {
        console.error('💥 Chat API error:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Helper: Get temperature based on response mode
function getTemperature(responseMode: AIMode): number {
    const temperatureMap: Record<AIMode, number> = {
        'quick': 0.3,      // More focused
        'normal': 0.7,     // Balanced
        'thinking': 0.5,   // Thoughtful
    };

    return temperatureMap[responseMode] || 0.7;
}

// Helper: Get max tokens based on response mode
function getMaxTokens(responseMode: AIMode): number {
    const tokensMap: Record<AIMode, number> = {
        'quick': 1000,      // Short responses
        'normal': 4000,     // Medium responses
        'thinking': 8000,   // Long responses
    };

    return tokensMap[responseMode] || 4000;
}
