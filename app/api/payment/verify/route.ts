// Verify Razorpay Payment API
// Verifies payment signature and activates subscription

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAllDBs } from '@/lib/database/multi-db';

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing payment details' },
                { status: 400 }
            );
        }

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Get authenticated user
        const { data: { session } } = await getAllDBs()[0].auth.getSession();
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Update payment record
        const { data: payment, error: paymentError } = await getAllDBs()[0]
            .from('payments')
            .update({
                razorpay_payment_id,
                razorpay_signature,
                status: 'captured',
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', razorpay_order_id)
            .eq('user_id', session.user.id)
            .select()
            .single();

        if (paymentError || !payment) {
            console.error('Payment update error:', paymentError);
            return NextResponse.json(
                { error: 'Payment record not found' },
                { status: 404 }
            );
        }

        // Calculate subscription expiry
        const expiresAt = new Date();
        if (payment.billing_period === 'monthly') {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (payment.billing_period === 'yearly') {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }

        // Update or create subscription
        const { error: subscriptionError } = await getAllDBs()[0]
            .from('subscriptions')
            .upsert({
                user_id: session.user.id,
                plan_type: payment.plan_type,
                status: 'active',
                billing_period: payment.billing_period,
                amount_paid: payment.amount,
                started_at: new Date().toISOString(),
                expires_at: expiresAt.toISOString(),
                last_payment_id: payment.id,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id'
            });

        if (subscriptionError) {
            console.error('Subscription update error:', subscriptionError);
        }

        // Update user profile
        const { error: profileError } = await getAllDBs()[0]
            .from('profiles')
            .update({
                plan: payment.plan_type,
                plan_expires_at: expiresAt.toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('id', session.user.id);

        if (profileError) {
            console.error('Profile update error:', profileError);
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            payment: {
                id: payment.id,
                plan_type: payment.plan_type,
                amount: payment.amount,
                expires_at: expiresAt.toISOString(),
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: 'Payment verification failed' },
            { status: 500 }
        );
    }
}
