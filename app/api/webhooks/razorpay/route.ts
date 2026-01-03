// Razorpay Webhook Handler
import { NextRequest, NextResponse } from 'next/server';
import { getAllDBs } from '@/lib/database/multi-db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        // Verify webhook signature
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('❌ Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        const event = JSON.parse(body);
        console.log(`📨 Webhook received: ${event.event}`);

        // Handle different webhook events
        switch (event.event) {
            case 'subscription.charged':
                await handleSubscriptionCharged(event.payload);
                break;

            case 'subscription.cancelled':
                await handleSubscriptionCancelled(event.payload);
                break;

            case 'subscription.halted':
                await handleSubscriptionHalted(event.payload);
                break;

            case 'subscription.paused':
                await handleSubscriptionPaused(event.payload);
                break;

            default:
                console.log(`ℹ️ Unhandled event: ${event.event}`);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// Handle successful payment
async function handleSubscriptionCharged(payload: any) {
    try {
        const subscription = payload.subscription.entity;
        const payment = payload.payment.entity;

        console.log(`💰 Payment successful: ${payment.id}`);
        console.log(`Subscription ID: ${subscription.id}`);

        // Find user by subscription ID or payment notes
        const databases = getAllDBs();

        // You'll need to store subscription_id in your subscriptions table
        // For now, we'll use payment notes to find user
        const userId = payment.notes?.user_id;

        if (!userId) {
            console.error('No user_id in payment notes');
            return;
        }

        // Find user's database
        let userDb = null;
        for (const db of databases) {
            const { data } = await db
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();

            if (data) {
                userDb = db;
                break;
            }
        }

        if (!userDb) {
            console.error('User not found');
            return;
        }

        // Extend subscription expiry
        const startsAt = new Date();
        const expiresAt = new Date(startsAt);
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        await userDb
            .from('subscriptions')
            .update({
                status: 'active',
                starts_at: startsAt.toISOString(),
                expires_at: expiresAt.toISOString(),
                last_payment_id: payment.id,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        console.log(`✅ Subscription extended until ${expiresAt.toISOString()}`);

    } catch (error) {
        console.error('Error handling subscription.charged:', error);
    }
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(payload: any) {
    try {
        const subscription = payload.subscription.entity;
        console.log(`🚫 Subscription cancelled: ${subscription.id}`);

        // Extract user_id from subscription notes
        const userId = subscription.notes?.user_id;

        if (!userId) {
            console.error('No user_id in subscription notes');
            return;
        }

        // Find user's database
        const databases = getAllDBs();
        let userDb = null;

        for (const db of databases) {
            const { data } = await db
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (data) {
                userDb = db;
                break;
            }
        }

        if (!userDb) {
            console.error('Subscription not found');
            return;
        }

        // Update status to cancelled (keep expires_at for grace period)
        await userDb
            .from('subscriptions')
            .update({
                status: 'cancelled',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        console.log(`✅ Subscription marked as cancelled - grace period active`);

    } catch (error) {
        console.error('Error handling subscription.cancelled:', error);
    }
}

// Handle payment failure
async function handleSubscriptionHalted(payload: any) {
    try {
        const subscription = payload.subscription.entity;
        console.log(`⚠️ Subscription halted (payment failed): ${subscription.id}`);

        const userId = subscription.notes?.user_id;

        if (!userId) {
            console.error('No user_id in subscription notes');
            return;
        }

        // Find user's database
        const databases = getAllDBs();
        let userDb = null;

        for (const db of databases) {
            const { data } = await db
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (data) {
                userDb = db;
                break;
            }
        }

        if (!userDb) {
            console.error('Subscription not found');
            return;
        }

        // Update status to halted
        await userDb
            .from('subscriptions')
            .update({
                status: 'halted',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        console.log(`✅ Subscription halted - user needs to update payment method`);

        // TODO: Send email notification to user

    } catch (error) {
        console.error('Error handling subscription.halted:', error);
    }
}

// Handle subscription pause
async function handleSubscriptionPaused(payload: any) {
    try {
        const subscription = payload.subscription.entity;
        console.log(`⏸️ Subscription paused: ${subscription.id}`);

        // Similar logic to cancelled, but with 'paused' status
        // User can resume later

    } catch (error) {
        console.error('Error handling subscription.paused:', error);
    }
}
