'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signIn } from '@/lib/auth-simple';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { user, error: authError } = await signIn(formData.email, formData.password);

        if (authError) {
            setError(authError);
            setLoading(false);
            return;
        }

        // Success! Redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <main className="relative min-h-screen overflow-hidden flex items-center justify-center" style={{ padding: '48px 0' }}>
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Content Container */}
            <div className="relative z-10 w-full" style={{ maxWidth: '650px', padding: '0 24px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="glass rounded-3xl"
                    style={{ padding: '48px 40px' }}
                >
                    {/* Logo Section */}
                    <Link href="/" className="flex justify-center" style={{ marginBottom: '40px' }}>
                        <div className="relative">
                            <div className="absolute inset-0 blur-xl opacity-50" style={{ background: 'var(--gradient-hero)' }} />
                            <Image
                                src="/bandhannova-logo-final.svg"
                                alt="BandhanNova"
                                width={250}
                                height={250}
                                className="relative z-10"
                            />
                        </div>
                    </Link>

                    {/* Title Section */}
                    <div style={{ marginBottom: '40px' }}>
                        <h1 className="h1 text-center" style={{ color: 'var(--foreground)', marginBottom: '12px' }}>
                            Welcome Back
                        </h1>
                        <p className="body text-center" style={{ color: 'var(--foreground-secondary)', fontSize: '16px' }}>
                            Login to continue your growth journey
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div style={{ marginBottom: '24px' }}>
                            <label
                                className="block text-sm font-medium"
                                style={{ color: 'var(--foreground)', marginBottom: '12px' }}
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute w-5 h-5"
                                    style={{
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--foreground-tertiary)'
                                    }}
                                />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full glass border-0 focus:ring-2 focus:ring-purple-500 transition-all rounded-2xl"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '16px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        color: 'var(--foreground)',
                                        background: 'var(--background-secondary)',
                                        fontSize: '15px'
                                    }}
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: '16px' }}>
                            <label
                                className="block text-sm font-medium"
                                style={{ color: 'var(--foreground)', marginBottom: '12px' }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute w-5 h-5"
                                    style={{
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--foreground-tertiary)'
                                    }}
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full glass border-0 focus:ring-2 focus:ring-purple-500 transition-all rounded-2xl"
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: '48px',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        color: 'var(--foreground)',
                                        background: 'var(--background-secondary)',
                                        fontSize: '15px'
                                    }}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute"
                                    style={{
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--foreground-tertiary)'
                                    }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end" style={{ marginBottom: '32px' }}>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium transition-colors hover:text-white"
                                style={{ color: 'var(--accent-cyan)' }}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="rounded-xl"
                                style={{
                                    padding: '12px 16px',
                                    marginBottom: '24px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#ef4444'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                padding: '16px 32px',
                                background: loading ? 'var(--background-secondary)' : 'var(--gradient-hero)',
                                color: 'white',
                                fontSize: '16px',
                                marginBottom: '32px'
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login to Account'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm" style={{ color: 'var(--foreground-secondary)', marginTop: '32px' }}>
                        Don't have an account?{' '}
                        <Link
                            href="/signup"
                            className="font-semibold transition-colors hover:text-white"
                            style={{ color: 'var(--accent-cyan)' }}
                        >
                            Sign up for free
                        </Link>
                    </p>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center"
                    style={{ marginTop: '32px' }}
                >
                    <Link
                        href="/"
                        className="text-lg font-medium transition-all duration-300 hover:text-white hover:scale-105"
                        style={{ color: 'var(--foreground-tertiary)', display: 'inline-block' }}
                    >
                        ← Back to Home
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
