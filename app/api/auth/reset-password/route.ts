// Reset Password API - Verify token and update password
import { NextRequest, NextResponse } from 'next/server';
import { getAllDBs } from '@/lib/database/multi-db';

export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: 'Token and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Find token in all databases
        const databases = getAllDBs();
        let userDb = null;
        let resetToken = null;

        for (const db of databases) {
            const { data } = await db
                .from('reset_tokens')
                .select('*')
                .eq('token', token)
                .eq('used', false)
                .single();

            if (data) {
                userDb = db;
                resetToken = data;
                break;
            }
        }

        if (!userDb || !resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Check if token is expired
        const now = new Date();
        const expiresAt = new Date(resetToken.expires_at);

        if (expiresAt < now) {
            return NextResponse.json(
                { error: 'Reset token has expired' },
                { status: 400 }
            );
        }

        // Update user password in Supabase Auth
        const { error: updateError } = await userDb.auth.admin.updateUserById(
            resetToken.user_id,
            { password: newPassword }
        );

        if (updateError) {
            console.error('❌ Error updating password:', updateError);
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        // Mark token as used
        await userDb
            .from('reset_tokens')
            .update({ used: true, updated_at: new Date().toISOString() })
            .eq('id', resetToken.id);

        console.log(`✅ Password reset successful for user ${resetToken.user_id}`);

        return NextResponse.json({
            success: true,
            message: 'Password reset successful! You can now login with your new password.'
        });

    } catch (error: any) {
        console.error('❌ Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
