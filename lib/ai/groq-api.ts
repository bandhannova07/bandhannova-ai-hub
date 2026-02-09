// Groq API Integration
// Supports multi-key rotation and rate-limit handling

import { groqKeyManager } from './groq-key-manager';
import { generateAppIdHeader } from './app-identification';

interface GroqMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function callGroqAPI(
    messages: Array<{ role: string; content: string }>,
    model: string = 'llama-3.3-70b-versatile'
): Promise<string> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = groqKeyManager.getNextKey();

        try {
            // Normalize messages for Groq
            const groqMessages: GroqMessage[] = messages.map(m => ({
                role: m.role as 'system' | 'user' | 'assistant',
                content: m.content
            }));

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'X-App-ID': generateAppIdHeader('Groq')
                },
                body: JSON.stringify({
                    messages: groqMessages,
                    model: model,
                    temperature: 0.7,
                    max_tokens: 4000
                })
            });

            if (!response.ok) {
                // If rate limited or unauthorized, throw special error to trigger retry
                if (response.status === 429 || response.status === 401) {
                    groqKeyManager.reportFailure(apiKey);
                    throw new Error(`Groq API Error: ${response.status}`);
                }
                const errorData = await response.json();
                throw new Error(`Groq API Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';

        } catch (error: any) {
            console.warn(`Attempt ${attempt + 1} failed with key ending in ...${apiKey.slice(-4)}: ${error.message}`);
            lastError = error;
            // If it's a critical error (not 429/401), maybe don't retry? 
            // For now, we retry on all to be safe with the "fallback" requirement.
        }
    }

    throw lastError || new Error('Failed to get response from Groq API after multiple retries');
}

export async function callGroqAPIStreaming(
    messages: Array<{ role: string; content: string }>,
    model: string = 'llama-3.3-70b-versatile'
): Promise<ReadableStream> {
    const maxRetries = 3;

    // For streaming, retry logic is harder because we return a stream.
    // We'll try to get a valid stream connection, then return it.

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const apiKey = groqKeyManager.getNextKey();

        try {
            const groqMessages: GroqMessage[] = messages.map(m => ({
                role: m.role as 'system' | 'user' | 'assistant',
                content: m.content
            }));

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'X-App-ID': generateAppIdHeader('Groq')
                },
                body: JSON.stringify({
                    messages: groqMessages,
                    model: model,
                    temperature: 0.7,
                    max_tokens: 4000,
                    stream: true
                })
            });

            if (!response.ok) {
                if (response.status === 429 || response.status === 401) {
                    groqKeyManager.reportFailure(apiKey);
                    // Continue to next attempt
                    continue;
                }
                throw new Error(`Groq API Stream Error: ${response.statusText}`);
            }

            // Return the stream directly from Groq (it's SSE compatible with OpenRouter format generally)
            // But we might need to transform it if the client expects a specific format.
            // Groq returns standard OpenAI-compatible SSE.
            return response.body as ReadableStream;

        } catch (error) {
            console.warn(`Stream Attempt ${attempt + 1} failed:`, error);
            if (attempt === maxRetries - 1) throw error;
        }
    }

    throw new Error('Failed to establish Groq stream');
}
