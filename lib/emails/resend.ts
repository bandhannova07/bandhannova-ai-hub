// Resend Client Setup
import { Resend } from 'resend';

// Lazy initialization to avoid client-side errors
let resendInstance: Resend | null = null;

export function getResendClient(): Resend {
    if (!resendInstance) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not set in environment variables');
        }
        resendInstance = new Resend(apiKey);
    }
    return resendInstance;
}

// Email sender configuration
export const EMAIL_FROM = 'BandhanNova <onboarding@resend.dev>'; // Will change to custom domain later

// App URL for links
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
