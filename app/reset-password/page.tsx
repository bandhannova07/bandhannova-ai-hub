'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { getAllDBs } from '@/lib/database/multi-db';

export const dynamic = 'force-dynamic';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if we have a valid session from the reset link
        const checkSession = async () => {
            const { data: { session } } = await getAllDBs()[0].auth.getSession();
            if (!session) {
                setError('Invalid or expired reset link. Please request a new one.');
            }
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { error } = await getAllDBs()[0].auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center" style={{ padding: '24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl border"
                style={{
                    width: '100%',
                    maxWidth: '650px',
                    padding: '48px',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)'
                }}
            >
                {!success ? (
                    <>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div
                                className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'var(--gradient-hero)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                    marginTop: '20px',
                                    marginBottom: '20px'
                                }}
                            >
                                <Lock className="w-10 h-10 text-white" />
                            </div>
                            <h1
                                className="font-bold mb-3"
                                style={{
                                    fontSize: '32px',
                                    color: 'var(--foreground)',
                                    marginBottom: '5px'
                                }}
                            >
                                Reset Password
                            </h1>
                            <p
                                style={{
                                    fontSize: '16px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.6',
                                    marginBottom: '10px'
                                }}
                            >
                                Enter your new password below
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* New Password */}
                            <div className="mb-6">
                                <label
                                    htmlFor="password"
                                    className="block mb-2"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: 'var(--foreground)'
                                    }}
                                >
                                    New Password
                                </label>
                                <div className="relative" style={{ marginBottom: '10px' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter new password"
                                        className="w-full h-13 px-4 py-4 rounded-xl transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: 'var(--foreground)',
                                            fontSize: '18px',
                                            paddingLeft: '10px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        style={{ color: 'var(--foreground-secondary)' }}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-6">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block mb-2"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: 'var(--foreground)'
                                    }}
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Confirm new password"
                                        className="w-full h-13 px-4 py-4 rounded-xl transition-all"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: 'var(--foreground)',
                                            fontSize: '18px',
                                            paddingLeft: '10px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        style={{ color: 'var(--foreground-secondary)' }}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div
                                    className="mb-6 p-4 rounded-xl"
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        color: '#ef4444',
                                        marginTop: '10px',
                                        paddingLeft: '10px'
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-13 py-4 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: 'var(--gradient-hero)',
                                    color: 'white',
                                    fontSize: '18px',
                                    marginTop: '18px'
                                }}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="text-center">
                            <div
                                className="rounded-2xl flex items-center justify-center mb-6 mx-auto"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                                }}
                            >
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h1
                                className="font-bold mb-3"
                                style={{
                                    fontSize: '32px',
                                    color: 'var(--foreground)'
                                }}
                            >
                                Password Reset Successful!
                            </h1>
                            <p
                                className="mb-8"
                                style={{
                                    fontSize: '16px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.6'
                                }}
                            >
                                Your password has been successfully reset.
                                <br />
                                Redirecting to login...
                            </p>

                            <Link
                                href="/login"
                                className="block w-full py-4 rounded-xl font-semibold transition-all hover:scale-105 text-center"
                                style={{
                                    background: 'var(--gradient-hero)',
                                    color: 'white',
                                    fontSize: '16px'
                                }}
                            >
                                Go to Login
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p style={{ color: 'var(--foreground)' }}>Loading...</p>
                </div>
            </main>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
