import 'dotenv/config';
import { generateAppIdHeader, verifyAppIdHeader } from '../lib/ai/app-identification';

async function testEncryption() {
    console.log('🧪 Testing API App ID Encryption...');

    const platforms = ['OpenRouter', 'Groq', 'Gemini', 'Tavily'];

    for (const platform of platforms) {
        console.log(`\n--- Testing Platform: ${platform} ---`);
        const header = generateAppIdHeader(platform);
        console.log('Generated Header:', header.substring(0, 50) + '...');

        const decrypted = verifyAppIdHeader(header);
        console.log('Decrypted Payload:', decrypted);

        if (decrypted && decrypted.appId === 'BandhanNova-AI-Hub' && decrypted.platform === platform) {
            console.log(`✅ ${platform} Encryption/Decryption Test Passed!`);
            console.log(`   Timestamp: ${new Date(decrypted.timestamp).toLocaleString()}`);
            console.log(`   Nonce: ${decrypted.nonce}`);
        } else {
            console.error(`❌ ${platform} Encryption/Decryption Test Failed!`);
            process.exit(1);
        }
    }

    // Check pattern uniqueness between platforms within the same millisecond
    console.log('\n--- Cross-Platform Pattern Test ---');
    const orHeader = generateAppIdHeader('OpenRouter');
    const groqHeader = generateAppIdHeader('Groq');

    if (orHeader.split(':')[1] !== groqHeader.split(':')[1]) {
        console.log('✅ Unique patterns confirmed across platforms.');
    } else {
        console.error('❌ Patterns are identical across platforms!');
        process.exit(1);
    }
}

testEncryption().catch(console.error);
