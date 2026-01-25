// Google Gemini API Key Manager
// Handles rotation and fallback for multiple Gemini API keys

export class GeminiKeyManager {
    private static instance: GeminiKeyManager;
    private currentKeyIndex: number = 1;
    private readonly maxKeys: number = 15; // Supporting up to 15 keys

    private constructor() { }

    public static getInstance(): GeminiKeyManager {
        if (!GeminiKeyManager.instance) {
            GeminiKeyManager.instance = new GeminiKeyManager();
        }
        return GeminiKeyManager.instance;
    }

    /**
     * Get the current API key and rotate to the next one
     */
    public getNextKey(): string {
        let attempts = 0;

        while (attempts < this.maxKeys) {
            const keyEnvVar = `GOOGLE_GEMINI_API_KEY_${this.currentKeyIndex}`;
            const key = process.env[keyEnvVar];

            // Rotate index for next time
            this.rotateIndex();

            if (key) {
                return key;
            }

            // If key not found, try next index immediately
            attempts++;
        }

        // Fallback to default key
        if (process.env.GOOGLE_GEMINI_API_KEY) {
            return process.env.GOOGLE_GEMINI_API_KEY;
        }

        throw new Error('No valid Google Gemini API keys found (checked GOOGLE_GEMINI_API_KEY_1 to _15)');
    }

    public reportFailure(key: string): void {
        console.warn(`[GeminiKeyManager] Key failure reported. Rotating.`);
    }

    private rotateIndex(): void {
        this.currentKeyIndex++;
        if (this.currentKeyIndex > this.maxKeys) {
            this.currentKeyIndex = 1;
        }
    }
}

export const geminiKeyManager = GeminiKeyManager.getInstance();
