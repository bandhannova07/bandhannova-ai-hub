// Payment verification and plan upgrade
import { NextRequest, NextResponse } from 'next/server';
import { getAllDBs } from '@/lib/database/multi-db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planName,
            amount,
            userId
        } = await req.json();

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Payment verified! Update user's plan in database
        try {
            // Use userId from request if provided, otherwise try to get from session
            let userDbToUpdate = null;
            let userIdToUpdate = userId;

            if (!userIdToUpdate) {
                // Fallback: try to get from session
                const databases = getAllDBs();
                for (const db of databases) {
                    const { data: { session } } = await db.auth.getSession();
                    if (session) {
                        userIdToUpdate = session.user.id;
                        userDbToUpdate = db;
                        break;
                    }
                }
            }

            // Find user's database
            if (userIdToUpdate) {
                // Find which database has this user
                const databases = getAllDBs();
                for (const db of databases) {
                    const { data: profile } = await db
                        .from('profiles')
                        .select('id')
                        .eq('id', userIdToUpdate)
                        .single();

                    if (profile) {
                        userDbToUpdate = db;
                        break;
                    }
                }
            }

            if (userDbToUpdate && userIdToUpdate) {
                // Normalize plan name to lowercase
                const planValue = planName.toLowerCase();

                console.log(`🔍 Attempting to update plan for user: ${userIdToUpdate}`);
                console.log(`📝 Plan value: ${planValue}`);

                // Update plan in profiles table
                const { error: updateError } = await userDbToUpdate
                    .from('profiles')
                    .update({
                        plan: planValue,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userIdToUpdate);

                if (updateError) {
                    console.error('❌ Error updating plan:', updateError);
                } else {
                    console.log(`✅ Plan updated to ${planValue} for user ${userIdToUpdate}`);
                }

                // Create subscription record
                const startsAt = new Date();
                const expiresAt = new Date(startsAt);
                expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

                const { error: subError } = await userDbToUpdate
                    .from('subscriptions')
                    .upsert({
                        user_id: userIdToUpdate,
                        plan_type: planValue,
                        status: 'active',
                        starts_at: startsAt.toISOString(),
                        expires_at: expiresAt.toISOString(),
                        billing_period: 'monthly',
                        amount: amount, // Required field
                        currency: 'INR',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (subError) {
                    console.error('❌ Error creating subscription:', subError);
                } else {
                    console.log(`✅ Subscription created for ${planValue}`);
                }

                // Save payment record
                const { error: paymentError } = await userDbToUpdate
                    .from('payments')
                    .insert({
                        user_id: userIdToUpdate,
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        amount,
                        currency: 'INR',
                        status: 'captured',
                        plan_type: planValue,
                        billing_period: 'monthly',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (paymentError) {
                    console.error('❌ Error saving payment:', paymentError);
                } else {
                    console.log(`✅ Payment record saved: ${razorpay_payment_id}`);
                }

                // Send payment success email
                try {
                    const { sendPaymentSuccessEmail } = await import('@/lib/emails/send-email');
                    const { data: userData } = await userDbToUpdate
                        .from('profiles')
                        .select('email, full_name')
                        .eq('id', userIdToUpdate)
                        .single();

                    if (userData?.email) {
                        await sendPaymentSuccessEmail(
                            userData.email,
                            userData.full_name || 'User',
                            planValue.charAt(0).toUpperCase() + planValue.slice(1),
                            amount,
                            expiresAt.toISOString()
                        );
                        console.log(`📧 Payment success email sent to ${userData.email}`);
                    }
                } catch (emailError) {
                    console.error('❌ Error sending email:', emailError);
                    // Don't fail the payment if email fails
                }
            } else {
                console.error('❌ No user found! userDb:', !!userDbToUpdate, 'userId:', userIdToUpdate);
            }
        } catch (dbError) {
            console.error('Database update error:', dbError);
            // Don't fail the payment verification if DB update fails
        }

        console.log(`✅ Payment verified for ${planName} plan`);
        console.log(`Payment ID: ${razorpay_payment_id}`);
        console.log(`Order ID: ${razorpay_order_id}`);

        return NextResponse.json({
            success: true,
            message: 'Payment verified and plan upgraded successfully',
            planName,
            paymentId: razorpay_payment_id
        });
    } catch (error: any) {
        console.error('❌ Verification error:', error);
        return NextResponse.json(
            { error: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
