// Cancel Subscription API
import { NextRequest, NextResponse } from 'next/server';
import { getAllDBs } from '@/lib/database/multi-db';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            );
        }

        // Find user's database and subscription
        const databases = getAllDBs();
        let userDb = null;
        let subscription = null;

        for (const db of databases) {
            const { data } = await db
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
                .single();

            if (data) {
                userDb = db;
                subscription = data;
                break;
            }
        }

        if (!userDb || !subscription) {
            return NextResponse.json(
                { error: 'No active subscription found' },
                { status: 404 }
            );
        }

        // Update subscription status to cancelled
        const { error: updateError } = await userDb
            .from('subscriptions')
            .update({
                status: 'cancelled',
                updated_at: new Date().toISOString()
            })
            .eq('id', subscription.id);

        if (updateError) {
            console.error('Error cancelling subscription:', updateError);
            return NextResponse.json(
                { error: 'Failed to cancel subscription' },
                { status: 500 }
            );
        }

        // Calculate days remaining
        const expiresAt = new Date(subscription.expires_at);
        const now = new Date();
        const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        console.log(`✅ Subscription cancelled for user ${userId}`);
        console.log(`Plan active until: ${expiresAt.toISOString()}`);

        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled successfully',
            expiresAt: subscription.expires_at,
            daysRemaining,
            planType: subscription.plan_type
        });

    } catch (error: any) {
        console.error('❌ Cancel subscription error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
