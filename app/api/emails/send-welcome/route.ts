// Send Welcome Email API - Server-side only
import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/emails/send-email';

export async function POST(req: NextRequest) {
    try {
        const { email, name } = await req.json();

        if (!email || !name) {
            return NextResponse.json(
                { error: 'Email and name are required' },
                { status: 400 }
            );
        }

        // Send welcome email
        const result = await sendWelcomeEmail(email, name);

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Welcome email sent successfully'
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('❌ Send welcome email error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
