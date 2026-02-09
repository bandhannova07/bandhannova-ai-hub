import { NextRequest, NextResponse } from 'next/server';
import { getGuestStatus } from '@/lib/guest/tracking';

/**
 * GET /api/guest/status
 * Returns remaining guest credits for the requesting IP
 */
export async function GET(request: NextRequest) {
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

        const status = await getGuestStatus(ip);
        return NextResponse.json(status);
    } catch (error) {
        console.error('Guest status error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
