// SIMPLE RAZORPAY TEST - No Auth, No Database
// Just test if Razorpay payment works

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(req: NextRequest) {
    try {
        const { amount } = await req.json();

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `test_order_${Date.now()}`,
        });

        console.log('✅ Razorpay order created:', order.id);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount,
            currency: 'INR',
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error('❌ Razorpay error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
