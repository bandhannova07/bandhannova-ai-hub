
import 'dotenv/config';

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

// Actually Node 20+ has fetch globally. TSX usually handles this. Let's try without import first or use native fetch.

async function verifyOpenRouterKey(key: string, index: number) {
    if (!key) return { status: 'MISSING', message: 'Key not configured' };

    try {
        const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${key}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // OpenRouter valid response usually contains key info
            return { status: 'VALID', message: 'Active', details: JSON.stringify(data).substring(0, 50) + '...' };
        } else {
            return { status: 'INVALID', message: `Status ${response.status}: ${response.statusText}` };
        }
    } catch (error: any) {
        return { status: 'ERROR', message: error.message };
    }
}

async function verifyGroqKey(key: string, index: number) {
    if (!key) return { status: 'MISSING', message: 'Key not configured' };

    try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return { status: 'VALID', message: 'Active' };
        } else {
            return { status: 'INVALID', message: `Status ${response.status}: ${response.statusText}` };
        }
    } catch (error: any) {
        return { status: 'ERROR', message: error.message };
    }
}

async function verifyTavilyKey(key: string, index: number) {
    if (!key) return { status: 'MISSING', message: 'Key not configured' };

    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: key,
                query: 'test',
                max_results: 1
            })
        });

        if (response.ok) {
            return { status: 'VALID', message: 'Active' };
        } else {
            const text = await response.text();
            if (response.status === 429) {
                return { status: 'RATE_LIMIT', message: 'Rate Limited' };
            }
            return { status: 'INVALID', message: `Status ${response.status}: ${text}` };
        }
    } catch (error: any) {
        return { status: 'ERROR', message: error.message };
    }
}

async function verifyGeminiKey(key: string, index: number) {
    if (!key) return { status: 'MISSING', message: 'Key not configured' };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=${key}`,
            {
                method: 'GET', // Gemini GET endpoint for models info is better for verification than POST generate
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        // Actually for Gemini API key check, getting models is safer than generating content
        // GET https://generativelanguage.googleapis.com/v1beta/models/gemini-pro?key=YOUR_API_KEY

        const response2 = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash?key=${key}`,
            { method: 'GET' }
        );

        if (response2.ok) {
            return { status: 'VALID', message: 'Active' };
        } else {
            return { status: 'INVALID', message: `Status ${response2.status}: ${response2.statusText}` };
        }
    } catch (error: any) {
        return { status: 'ERROR', message: error.message };
    }
}

async function main() {
    console.log('🔍 Starting API Key Verification System...\n');

    // 1. Verify OpenRouter Keys
    console.log('--- 🤖 OpenRouter Keys (20 Slots) ---');
    for (let i = 1; i <= 20; i++) {
        const key = process.env[`OPENROUTER_API_KEY_${i}`] || '';
        const result = await verifyOpenRouterKey(key, i);
        const icon = result.status === 'VALID' ? '✅' : result.status === 'MISSING' ? '⚪' : '❌';
        console.log(`${icon} Key ${i.toString().padEnd(2)}: [${result.status}] ${result.message}`);
    }

    // 2. Verify Groq Keys
    console.log('\n--- ⚡ Groq Keys (15 Slots) ---');
    for (let i = 1; i <= 15; i++) {
        const key = process.env[`GROQ_API_KEY_${i}`] || '';
        const result = await verifyGroqKey(key, i);
        const icon = result.status === 'VALID' ? '✅' : result.status === 'MISSING' ? '⚪' : '❌';
        console.log(`${icon} Key ${i.toString().padEnd(2)}: [${result.status}] ${result.message}`);
    }

    // 3. Verify Gemini Keys
    console.log('\n--- 🌟 Gemini Keys (15 Slots) ---');
    for (let i = 1; i <= 15; i++) {
        const key = process.env[`GOOGLE_GEMINI_API_KEY_${i}`] || '';
        const result = await verifyGeminiKey(key, i);
        const icon = result.status === 'VALID' ? '✅' : result.status === 'MISSING' ? '⚪' : '❌';
        console.log(`${icon} Key ${i.toString().padEnd(2)}: [${result.status}] ${result.message}`);
    }

    // 4. Verify Tavily Keys
    console.log('\n--- 🔎 Tavily Keys (30 Slots) ---');
    for (let i = 1; i <= 30; i++) {
        const key = process.env[`TAVILY_API_KEY_${i}`] || '';
        const result = await verifyTavilyKey(key, i);
        const icon = result.status === 'VALID' ? '✅' : result.status === 'MISSING' ? '⚪' : result.status === 'RATE_LIMIT' ? '⚠️' : '❌';
        console.log(`${icon} Key ${i.toString().padEnd(2)}: [${result.status}] ${result.message}`);
    }

    console.log('\n✅ Verification Complete.');
}

main().catch(console.error);
