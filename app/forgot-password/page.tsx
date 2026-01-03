'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Call custom forgot password API
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
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
                {/* Back to Login */}
                <Link
                    href="/login"
                    className="flex items-center gap-2 mb-8 transition-colors hover:opacity-80"
                    style={{
                        fontSize: '14px',
                        color: 'var(--foreground-secondary)'
                    }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>

                {!sent ? (
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
                                <Mail className="w-10 h-10 text-white" />
                            </div>
                            <h1
                                className="font-bold mb-3"
                                style={{
                                    fontSize: '32px',
                                    color: 'var(--foreground)',
                                    marginBottom: '10px'
                                }}
                            >
                                Forgot Password?
                            </h1>
                            <p
                                style={{
                                    fontSize: '16px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.6',
                                    marginBottom: '10px'
                                }}
                            >
                                No worries! Enter your email and we'll send you a reset link
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Email Input */}
                            <div className="mb-6">
                                <label
                                    htmlFor="email"
                                    className="block mb-2"
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: 'var(--foreground)'
                                    }}
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full h-13 px-4 py-4 rounded-xl transition-all"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        color: 'var(--foreground)',
                                        fontSize: '18px',
                                        paddingLeft: '10px'
                                    }}
                                />
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
                                    fontSize: '16px',
                                    marginTop: '20px'
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
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
                                    width: '70px',
                                    height: '70px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                    marginTop: '20px',
                                    marginBottom: '20px'
                                }}
                            >
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h1
                                className="font-bold mb-3"
                                style={{
                                    fontSize: '32px',
                                    color: 'var(--foreground)',
                                    marginBottom: '10px'
                                }}
                            >
                                Check Your Email
                            </h1>
                            <p
                                className="mb-8"
                                style={{
                                    fontSize: '16px',
                                    color: 'var(--foreground-secondary)',
                                    lineHeight: '1.6'
                                }}
                            >
                                We've sent a password reset link to <strong>{email}</strong>
                                <br />
                                Please check your inbox and click the link to reset your password.
                            </p>

                            <Link
                                href="/login"
                                className="flex flex-col items-center justify-center block w-full h-13 py-4 rounded-xl font-semibold transition-all hover:scale-105"
                                style={{
                                    background: 'var(--gradient-hero)',
                                    color: 'white',
                                    fontSize: '18px',
                                    marginTop: '10px'
                                }}
                            >
                                Done
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </main>
    );
}
