// API Key Management System
// Manages OpenRouter API keys with rotation to distribute load

/**
 * Get a random OpenRouter API key from the available pool (1-20)
 * This distributes the load across multiple keys to avoid rate limits
 */
export function getRotatedApiKey(): string {
    const totalKeys = 20;
    const availableKeys: string[] = [];

    // Collect all available keys
    for (let i = 1; i <= totalKeys; i++) {
        const keyName = `OPENROUTER_API_KEY_${i}`;
        const key = process.env[keyName];

        if (key && key.startsWith('sk-or-')) {
            availableKeys.push(key);
        }
    }



    if (availableKeys.length === 0) {
        console.error('❌ No valid OpenRouter API keys found!');
        throw new Error('API keys not configured. Please add OPENROUTER_API_KEY_1 through OPENROUTER_API_KEY_20 to your env file.');
    }

    // Randomly select one key
    const randomIndex = Math.floor(Math.random() * availableKeys.length);
    const selectedKey = availableKeys[randomIndex];

    // Log which key index was selected (masking the key itself)
    // We can find the index by looking it up in env vars again or just logging the random index if debugging
    // For privacy, we just log that a key was selected
    // console.log(`🔑 Sourcing API Key from pool of ${availableKeys.length} keys`);

    return selectedKey;
}

/**
 * Validate that API keys are configured
 */
export function validateApiKeys(): { valid: boolean; count: number; missingIndices: number[] } {
    const totalKeys = 20;
    const missingIndices: number[] = [];
    let count = 0;

    for (let i = 1; i <= totalKeys; i++) {
        const keyName = `OPENROUTER_API_KEY_${i}`;
        const key = process.env[keyName];

        if (key && key.startsWith('sk-or-')) {
            count++;
        } else {
            missingIndices.push(i);
        }
    }

    return {
        valid: count > 0,
        count,
        missingIndices
    };
}
