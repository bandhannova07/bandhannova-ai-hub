// Chat API Endpoint with Model-Based Architecture
// Uses subscription-tier based model access with fallback chains

import { NextRequest } from 'next/server';
import {
    getModelConfig,
    hasModelAccess,
    ModelId,
    AI_MODELS
} from '@/lib/ai/model-tiers';
import { getRotatedApiKey } from '@/lib/ai/api-keys';
import { callGroqAPIStreaming } from '@/lib/ai/groq-api';
import { callGeminiAPIStreaming } from '@/lib/ai/gemini-api';
import { getUserTierSimple } from '@/lib/db/get-user-tier';
import { checkAndIncrementExtremeUsage } from '@/lib/ai/usage-tracker';
import { detectLanguage, getLanguageInstruction } from '@/lib/ai/language-detection';
import { buildOptimizedPrompt } from '@/lib/ai/optimized-prompts';
import { getAgentPrompt } from '@/lib/ai/agent-manager';
import { getModelIdentityPrompt } from '@/lib/ai/model-prompts';
import { COMPANY_KEYWORDS, getCompanyKnowledgeJSON } from '@/lib/ai/company-knowledge';
import { qaCache } from '@/lib/ai/qa-cache-manager';

type AIMode = 'quick' | 'normal' | 'thinking';

export const maxDuration = 60; // Allow up to 60 seconds for execution
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const {
            message,
            modelId,
            responseMode,
            conversationHistory,
            userId,
            enableSearch = false, // New: Enable Tavily AI search
            agentType, // New: Agent type for specific persona
        } = await req.json();

        // Validation
        if (!message || !modelId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: message and modelId' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // 0. CHECK QA CACHE
        // Only cache for simple/normal modes, and if no search/files involved
        if (!enableSearch && (!responseMode || responseMode === 'quick' || responseMode === 'normal')) {
            const cachedResponse = await qaCache.get(message, modelId);
            if (cachedResponse) {
                console.log('⚡ QA Cache Hit! Serving valid cached response.');
                return new Response(cachedResponse, {
                    headers: { 'X-Cache': 'HIT', 'X-Model-Used': modelId }
                });
            }
        }

        // Get user's subscription tier
        const userTier = userId ? await getUserTierSimple(userId) : 'free';
        console.log(`🎯 User tier: ${userTier}`);

        // Validate model access
        if (!hasModelAccess(userTier, modelId as ModelId)) {
            return new Response(
                JSON.stringify({
                    error: 'Model not available for your subscription tier',
                    requiredTier: AI_MODELS[modelId as ModelId]?.minTier,
                    currentTier: userTier
                }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Get model configuration
        const modelConfig = getModelConfig(modelId as ModelId);
        if (!modelConfig) {
            return new Response(
                JSON.stringify({ error: 'Invalid model ID' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check usage limits for BandhanNova 2.0 eXtreme
        if (modelConfig.isExtreme && userId) {
            const usageCheck = await checkAndIncrementExtremeUsage(userId, userTier);
            if (!usageCheck.allowed) {
                return new Response(
                    JSON.stringify({
                        error: 'Daily limit reached',
                        message: usageCheck.message,
                        currentUsage: usageCheck.currentUsage,
                        limit: usageCheck.limit
                    }),
                    { status: 429, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // Perform Tavily search if enabled
        let searchContext = '';
        if (enableSearch) {
            console.log('🔍 Performing Tavily search...');

            // Use advanced research for Deep Research AI, quick search for others
            if (modelId === 'bandhannova-research' || modelId === 'bandhannova-extreme') {
                const { researchWithTavily } = await import('@/lib/ai/tavily-search');
                const researchResult = await researchWithTavily(message);

                if (researchResult && researchResult.status === 'completed') {
                    searchContext = `\n\n**Research Results:**\n${researchResult.content}\n\n**Sources:**\n${researchResult.sources.map((s, i) => `${i + 1}. [${s.title}](${s.url})`).join('\n')}`;
                    console.log('✅ Advanced research completed');
                }
            } else {
                const { searchWithTavily } = await import('@/lib/ai/tavily-search');
                const searchResult = await searchWithTavily(message, 'advanced');

                if (searchResult && searchResult.results.length > 0) {
                    searchContext = `\n\n**Web Search Results:**\n${searchResult.results.slice(0, 3).map((r, i) =>
                        `${i + 1}. **${r.title}**\n   ${r.content}\n   Source: ${r.url}`
                    ).join('\n\n')}`;

                    if (searchResult.answer) {
                        searchContext = `\n\n**Quick Answer:** ${searchResult.answer}\n${searchContext}`;
                    }
                    console.log('✅ Quick search completed');
                }
            }
        }

        // Language detection
        let userLanguage = detectLanguage(message);

        // Build system prompt
        const mode = (responseMode as AIMode) || 'normal';
        let systemPrompt: string;

        // 0.5 Fetch User Onboarding Data for Context
        let userContext = null;
        if (userId) {
            try {
                // Assuming simple query for now
                const { supabase } = await import('@/lib/supabase');
                const { data } = await supabase
                    .from('user_onboarding')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (data) userContext = data;
            } catch (err) {
                console.warn('Failed to fetch user context:', err);
            }
        }

        // 1. Get Agent Persona
        // 1. Get Agent Persona
        if (agentType) {
            systemPrompt = await getAgentPrompt(agentType, mode, userContext);
        } else {
            // For standard search, we specifically inject it via the updated prompt function
            if (modelId === 'bandhannova-research' || modelId === 'bandhannova-extreme') {
                const { searchEnginePrompt } = await import('@/lib/ai/agents/search-engine');
                // Ensure searchEnginePrompt is a function before calling, handle backward compatibility
                if (typeof searchEnginePrompt === 'function') {
                    systemPrompt = searchEnginePrompt(userContext);
                } else {
                    systemPrompt = searchEnginePrompt;
                }
            } else {
                systemPrompt = await buildOptimizedPrompt(userContext);
            }
        }

        // 2. Inject Model Identity (Top Layer)
        const modelIdentity = getModelIdentityPrompt(modelId as ModelId);
        systemPrompt = `${modelIdentity}\n\n${systemPrompt}`;


        // 3. Inject Company Knowledge (Conditional Layer)
        // Check if message contains any company keywords
        const lowerMessage = message.toLowerCase();
        const hasCompanyKeyword = COMPANY_KEYWORDS.some(keyword => lowerMessage.includes(keyword));

        if (hasCompanyKeyword) {
            console.log('🏢 Transforming prompt with Company Knowledge');
            const companyContext = getCompanyKnowledgeJSON();
            systemPrompt = `${systemPrompt}\n\n**RELEVANT CONTEXT (Use this to answer questions about BandhanNova):**\n${companyContext}`;
        }

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

        // Add current user message with search context if available
        const userMessageContent = searchContext
            ? `${message}${searchContext}\n\n**Note:** Use the above search results to provide an accurate answer.`
            : message;
        messages.push({ role: 'user', content: userMessageContent });

        // Iterate through the backend chain
        const backends = modelConfig.backends;

        for (let i = 0; i < backends.length; i++) {
            const backend = backends[i];
            const currentModelId = backend.modelId;
            const logPrefix = `Attempt ${i + 1}/${backends.length} [${backend.provider.toUpperCase()}]:`;

            try {
                console.log(`${logPrefix} Trying model ${currentModelId}...`);

                let responseStream: ReadableStream;

                if (backend.provider === 'openrouter') {
                    // OpenRouter Logic
                    const apiKey = getRotatedApiKey();

                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`,
                            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://www.bandhannova.in',
                            'X-Title': 'BandhanNova AI Hub',
                        },
                        body: JSON.stringify({
                            model: currentModelId,
                            messages,
                            stream: true,
                            temperature: modelConfig.temperature,
                            max_tokens: modelConfig.maxTokens,
                        }),
                        signal: AbortSignal.timeout(60000), // 60s timeout for OpenRouter
                    });

                    if (!response.ok) {
                        if (response.status === 429) {
                            console.warn(`${logPrefix} Rate limited (429).`);
                            continue;
                        }
                        throw new Error(`OpenRouter API status: ${response.status}`);
                    }

                    if (!response.body) throw new Error('No response body from OpenRouter');
                    responseStream = response.body;

                } else if (backend.provider === 'groq') {
                    // Groq Logic
                    responseStream = await callGroqAPIStreaming(messages, currentModelId);

                } else if (backend.provider === 'gemini') {
                    // Gemini Logic
                    responseStream = await callGeminiAPIStreaming(messages, currentModelId);

                } else {
                    console.error(`Unknown provider: ${backend.provider}`);
                    continue;
                }

                console.log(`${logPrefix} ✅ Success!`);

                // Tee the stream to capture for caching
                const [stream1, stream2] = responseStream.tee();

                // Process stream2 to cache content (fire and forget)
                (async () => {
                    try {
                        const reader = stream2.getReader();
                        const decoder = new TextDecoder();
                        let fullText = '';

                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value, { stream: true });
                            // We need to parse SSE data format "data: {...}"
                            const lines = chunk.split('\n');
                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    try {
                                        const json = JSON.parse(line.substring(6));
                                        if (json.choices?.[0]?.delta?.content) {
                                            fullText += json.choices[0].delta.content;
                                        }
                                    } catch (e) { /* ignore parse error */ }
                                }
                            }
                        }

                        // Cache the full text
                        if (fullText.length > 10) {
                            await qaCache.set(message, modelId, fullText);
                            console.log('💾 Response cached for future queries.');
                        }
                    } catch (err) {
                        console.warn('Failed to cache stream:', err);
                    }
                })();

                // Return streaming response
                return new Response(stream1, {
                    headers: {
                        'Content-Type': 'text/event-stream; charset=utf-8',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'X-Model-Used': currentModelId,
                        'X-Provider': backend.provider,
                        'X-User-Tier': userTier,
                        'X-Attempt': String(i + 1),
                        'X-Cache': 'MISS'
                    },
                });

            } catch (error: any) {
                console.error(`${logPrefix} ❌ Failed:`, error.message);

                // If this was the last backend, throw error
                if (i === backends.length - 1) {
                    throw new Error(
                        `All backend providers failed. Last error: ${error.message}`
                    );
                }
            }
        }

        // Should never reach here
        throw new Error('Unexpected error: fallback chain exhausted');

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
