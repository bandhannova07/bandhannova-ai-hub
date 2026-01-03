// Create Razorpay Order API
// Creates a payment order for subscription purchase

import { NextRequest, NextResponse } from 'next/server';
import { razorpay, PLAN_PRICES } from '@/lib/razorpay/client';
import { getAllDBs } from '@/lib/database/multi-db';

export async function POST(req: NextRequest) {
    try {
        const { planType, billingPeriod } = await req.json();

        // Validate input
        if (!planType || !billingPeriod) {
            return NextResponse.json(
                { error: 'Plan type and billing period are required' },
                { status: 400 }
            );
        }

        if (!['pro', 'enterprise'].includes(planType)) {
            return NextResponse.json(
                { error: 'Invalid plan type' },
                { status: 400 }
            );
        }

        if (!['monthly', 'yearly'].includes(billingPeriod)) {
            return NextResponse.json(
                { error: 'Invalid billing period' },
                { status: 400 }
            );
        }

        // TEMPORARY: Skip auth for demo - FIX LATER
        const userDb = getAllDBs()[0]; // Use first DB for demo
        const session = { user: { id: 'demo-user-' + Date.now() } }; // Fake session for demo

        /*
        // Get authenticated user - check all databases
        const databases = getAllDBs();
        let session = null;
        let userDb = null;

        for (const db of databases) {
            const { data: { session: dbSession } } = await db.auth.getSession();
            if (dbSession) {
                session = dbSession;
                userDb = db;
                break;
            }
        }

        if (!session || !userDb) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login first' },
                { status: 401 }
            );
        }
        */

        // Get amount from pricing
        const amount = PLAN_PRICES[planType as 'pro' | 'enterprise'][billingPeriod as 'monthly' | 'yearly'];

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise (₹1 = 100 paise)
            currency: 'INR',
            receipt: `order_${Date.now()}_${session.user.id.substring(0, 8)}`,
            notes: {
                user_id: session.user.id,
                plan_type: planType,
                billing_period: billingPeriod,
            },
        });

        // Save payment record to database (user's DB)
        const { error: dbError } = await userDb.from('payments').insert({
            user_id: session.user.id,
            razorpay_order_id: order.id,
            amount,
            currency: 'INR',
            plan_type: planType,
            billing_period: billingPeriod,
            status: 'created',
            metadata: {
                order_details: order,
            },
        });

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json(
                { error: 'Failed to save payment record' },
                { status: 500 }
            );
        }

        // Return order details for frontend
        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount,
            currency: 'INR',
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment order' },
            { status: 500 }
        );
    }
}
