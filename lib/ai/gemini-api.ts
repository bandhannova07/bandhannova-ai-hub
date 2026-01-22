// Google Gemini API Integration
// Fallback when OpenRouter is rate limited

export async function callGeminiAPI(
    messages: Array<{ role: string; content: string }>,
    model: string = 'gemini-2.5-flash'
): Promise<string> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Google Gemini API key not found');
    }

    // Convert messages to Gemini format
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    // Build Gemini prompt
    let prompt = '';
    if (systemMessage) {
        prompt += systemMessage.content + '\n\n';
    }

    // Add conversation history
    for (const msg of userMessages) {
        if (msg.role === 'user') {
            prompt += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
            prompt += `Assistant: ${msg.content}\n`;
        }
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Gemini API failed: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return text;
    } catch (error: any) {
        console.error('Gemini API error:', error);
        throw error;
    }
}

export async function callGeminiAPIStreaming(
    messages: Array<{ role: string; content: string }>,
    model: string = 'gemini-2.5-flash'
): Promise<ReadableStream> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Google Gemini API key not found');
    }

    // Convert messages to Gemini format
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');

    let prompt = '';
    if (systemMessage) {
        prompt += systemMessage.content + '\n\n';
    }

    for (const msg of userMessages) {
        if (msg.role === 'user') {
            prompt += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
            prompt += `Assistant: ${msg.content}\n`;
        }
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini streaming failed: ${response.statusText}`);
    }

    // Transform Gemini SSE to OpenRouter format
    return new ReadableStream({
        async start(controller) {
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                controller.close();
                return;
            }

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

                                if (text) {
                                    // Convert to OpenRouter format
                                    const formatted = `data: ${JSON.stringify({
                                        choices: [{ delta: { content: text } }]
                                    })}\n\n`;
                                    controller.enqueue(new TextEncoder().encode(formatted));
                                }
                            } catch (e) {
                                // Skip invalid JSON
                            }
                        }
                    }
                }
            } finally {
                controller.close();
            }
        }
    });
}
