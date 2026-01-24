// Chat API Endpoint with Model-Based Architecture
// Uses subscription-tier based model access with fallback chains

import { NextRequest } from 'next/server';
import {
    getModelConfig,
    hasModelAccess,
    getApiKeyTier,
    ModelId,
    AI_MODELS
} from '@/lib/ai/model-tiers';
import { getApiKeyForTier } from '@/lib/ai/api-keys';
import { getUserTierSimple } from '@/lib/db/get-user-tier';
import { checkAndIncrementExtremeUsage } from '@/lib/ai/usage-tracker';
import { detectLanguage, getLanguageInstruction } from '@/lib/ai/language-detection';
import { buildOptimizedPrompt } from '@/lib/ai/optimized-prompts';
import { getAgentPrompt } from '@/lib/ai/agent-manager';
import { getModelIdentityPrompt } from '@/lib/ai/model-prompts';
import { COMPANY_KEYWORDS, getCompanyKnowledgeJSON } from '@/lib/ai/company-knowledge';
import { AIMode } from '@/lib/ai/models/config';
import { searchWithTavily } from '@/lib/ai/tavily-search';

export const runtime = 'edge';

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

        // Get appropriate API key for this model
        const apiKeyTier = getApiKeyTier(modelId as ModelId);
        const apiKey = getApiKeyForTier(apiKeyTier);
        console.log(`🔑 Using API key tier: ${apiKeyTier}`);

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

        // 1. Get Agent Persona
        if (agentType) {
            systemPrompt = getAgentPrompt(agentType, mode);
        } else {
            systemPrompt = buildOptimizedPrompt(mode, message);
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

        // Build fallback chain: primary + fallbacks
        const modelChain = [modelConfig.primaryModel, ...modelConfig.fallbackModels];
        console.log(`🔗 Model chain: ${modelChain.join(' → ')}`);

        // Try each model in the fallback chain
        for (let i = 0; i < modelChain.length; i++) {
            const currentModel = modelChain[i];

            try {
                console.log(`🤖 Trying model: ${currentModel} (attempt ${i + 1}/${modelChain.length})`);

                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://www.bandhannova.in',
                        'X-Title': 'BandhanNova AI Hub',
                    },
                    body: JSON.stringify({
                        model: currentModel,
                        messages,
                        stream: true,
                        temperature: modelConfig.temperature,
                        max_tokens: modelConfig.maxTokens,
                    }),
                    signal: AbortSignal.timeout(30000), // 30 second timeout
                });

                if (!response.ok) {
                    // Check for rate limit
                    if (response.status === 429) {
                        console.log(`⚠️ Rate limited on ${currentModel}, trying next model...`);
                        continue;
                    }
                    throw new Error(`Model ${currentModel} failed: ${response.statusText}`);
                }

                console.log(`✅ Success with ${currentModel}`);

                // Return streaming response
                return new Response(response.body, {
                    headers: {
                        'Content-Type': 'text/event-stream; charset=utf-8',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                        'X-Model-Used': currentModel,
                        'X-Model-Config': modelConfig.name,
                        'X-User-Tier': userTier,
                        'X-Attempt': String(i + 1),
                    },
                });

            } catch (error: any) {
                console.error(`❌ Model ${currentModel} failed:`, error.message);

                // If this was the last model, throw error
                if (i === modelChain.length - 1) {
                    throw new Error(
                        `All models in fallback chain failed. Last error: ${error.message}`
                    );
                }

                // Otherwise, continue to next model
                console.log(`🔄 Trying next model in fallback chain...`);
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
