import { NextRequest, NextResponse } from 'next/server';
import { trackGuestQuery } from '@/lib/guest/tracking';

/**
 * POST /api/guest/track
 * Tracks a guest query and decrements credits
 */
export async function POST(request: NextRequest) {
    try {
        // Extract IP from headers
        const forwarded = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';

        if (ip === 'unknown') {
            return NextResponse.json(
                { error: 'Could not determine IP address' },
                { status: 400 }
            );
        }

        const result = await trackGuestQuery(ip);

        if (!result.success) {
            return NextResponse.json(result, { status: 429 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Guest track error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
