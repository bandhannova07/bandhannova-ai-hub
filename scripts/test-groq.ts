// Test script for Groq API Integration

import { groqKeyManager } from '../lib/ai/groq-key-manager';
import { callGroqAPI, callGroqAPIStreaming } from '../lib/ai/groq-api';

async function testGroqIntegration() {
    console.log('🧪 Starting Groq API Integration Test...\n');

    // 1. Test Key Manager
    console.log('1. Testing Key Manager Rotation:');
    try {
        const key1 = groqKeyManager.getNextKey();
        console.log(`   Key 1: ...${key1.slice(-6)}`);

        const key2 = groqKeyManager.getNextKey();
        console.log(`   Key 2: ...${key2.slice(-6)}`);

        if (key1 !== key2) {
            console.log('   ✅ Key rotation working (keys are different)');
        } else {
            console.log('   ⚠️ Keys are same (might rely on fallback or only 1 key set)');
        }
    } catch (e: any) {
        console.log(`   ❌ Key Manager Error: ${e.message}`);
    }

    // 2. Test Standard API Call
    console.log('\n2. Testing Standard API Call:');
    try {
        const response = await callGroqAPI([
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Say "Hello, World!" and nothing else.' }
        ]);
        console.log(`   Response: "${response}"`);
        console.log('   ✅ Standard call successful');
    } catch (e: any) {
        console.log(`   ❌ Standard Call Error: ${e.message}`);
    }

    // 3. Test Streaming API Call
    console.log('\n3. Testing Streaming API Call:');
    try {
        const stream = await callGroqAPIStreaming([
            { role: 'user', content: 'Count from 1 to 3.' }
        ]);

        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        console.log('   Stream output:');
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            // Verify chunk format a bit (it's raw bytes/text from fetch body)
            // Groq sends SSE "data: ..." lines.
            // For this test we just want to see we got *something*
            fullText += chunk;
        }
        console.log(`   (Received ${fullText.length} bytes of stream data)`);
        console.log('   ✅ Streaming call successful');
    } catch (e: any) {
        console.log(`   ❌ Streaming Call Error: ${e.message}`);
    }
}

// Check for API Keys before running
if (!process.env.GROQ_API_KEY_1 && !process.env.GROQ_API_KEY) {
    console.error('❌ No GROQ_API_KEY_1 or GROQ_API_KEY found in environment variables.');
    console.log('   Please run with: GROQ_API_KEY_1=... ts-node scripts/test-groq.ts');
} else {
    testGroqIntegration();
}
