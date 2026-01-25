// Groq API Key Manager
// Handles rotation and fallback for multiple Groq API keys

export class GroqKeyManager {
    private static instance: GroqKeyManager;
    private currentKeyIndex: number = 1;
    private readonly maxKeys: number = 12; // Supporting up to 12 keys as requested (10-12)

    private constructor() { }

    public static getInstance(): GroqKeyManager {
        if (!GroqKeyManager.instance) {
            GroqKeyManager.instance = new GroqKeyManager();
        }
        return GroqKeyManager.instance;
    }

    /**
     * Get the current API key and rotate to the next one for the subsequent call
     * This implements a simple Round-Robin strategy
     */
    public getNextKey(): string {
        let attempts = 0;

        while (attempts < this.maxKeys) {
            const keyEnvVar = `GROQ_API_KEY_${this.currentKeyIndex}`;
            const key = process.env[keyEnvVar];

            // Rotate index for next time (1 -> 2 -> ... -> 12 -> 1)
            this.rotateIndex();

            if (key) {
                return key;
            }

            // If key not found, try next index immediately
            attempts++;
        }

        // Fallback to a default single key if defined (for backward compatibility or testing)
        if (process.env.GROQ_API_KEY) {
            return process.env.GROQ_API_KEY;
        }

        throw new Error('No valid Groq API keys found in environment variables (checked GROQ_API_KEY_1 to GROQ_API_KEY_12)');
    }

    /**
     * Report a key failure (e.g., 429 Rate Limit) to potentially temporarily disable it
     * For now, we just ensure we rotate away from it (which getNextKey already does)
     */
    public reportFailure(key: string): void {
        console.warn(`[GroqKeyManager] Key failure reported. Rotating to next key.`);
        // In a more advanced implementation, we could blacklist this key for a few minutes
    }

    private rotateIndex(): void {
        this.currentKeyIndex++;
        if (this.currentKeyIndex > this.maxKeys) {
            this.currentKeyIndex = 1;
        }
    }
}

export const groqKeyManager = GroqKeyManager.getInstance();
