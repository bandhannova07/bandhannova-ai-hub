// Forgot Password API - Generate reset token and send email
import { NextRequest, NextResponse } from 'next/server';
import { getAllDBs } from '@/lib/database/multi-db';
import { sendForgotPasswordEmail } from '@/lib/emails/send-email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user in all databases
        const databases = getAllDBs();
        let userDb = null;
        let user = null;

        console.log(`🔍 Searching for email: ${email.toLowerCase()} in ${databases.length} databases...`);

        for (let i = 0; i < databases.length; i++) {
            const db = databases[i];
            console.log(`  📊 Checking database ${i + 1}...`);

            const { data, error } = await db
                .from('profiles')
                .select('id, email, full_name')
                .eq('email', email.toLowerCase())
                .single();

            if (error) {
                console.log(`  ❌ DB${i + 1} error:`, error.message);
            }

            if (data) {
                userDb = db;
                user = data;
                console.log(`  ✅ Found user in database ${i + 1}!`);
                break;
            } else {
                console.log(`  ⚠️ Not found in database ${i + 1}`);
            }
        }

        // Always return success to prevent email enumeration
        if (!userDb || !user) {
            console.log(`⚠️ Password reset requested for non-existent email: ${email}`);
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.'
            });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

        // Store reset token in database
        const { error: tokenError } = await userDb
            .from('reset_tokens')
            .insert({
                user_id: user.id,
                token: resetToken,
                expires_at: expiresAt.toISOString(),
                used: false
            });

        if (tokenError) {
            console.error('❌ Error creating reset token:', tokenError);
            return NextResponse.json(
                { error: 'Failed to create reset token' },
                { status: 500 }
            );
        }

        // Send password reset email
        try {
            await sendForgotPasswordEmail(
                user.email,
                user.full_name || 'User',
                resetToken
            );
            console.log(`✅ Password reset email sent to ${user.email}`);
        } catch (emailError) {
            console.error('❌ Error sending reset email:', emailError);
            return NextResponse.json(
                { error: 'Failed to send reset email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.'
        });

    } catch (error: any) {
        console.error('❌ Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
