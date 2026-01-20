'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { leadersSignIn } from '@/lib/auth/leaders-auth';
import { LeadersLoginSkeleton } from '../components/LeadersSkeleton';

export default function LeadersLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    // Handle client-side mounting
    useState(() => {
        setMounted(true);
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { user, error: authError } = await leadersSignIn(email, password);

            if (authError || !user) {
                setError(authError?.message || 'Invalid email or password');
                setLoading(false);
                return;
            }

            // Success - redirect to leaders chat
            router.push('/leaders');
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
            setLoading(false);
        }
    };

    if (!mounted) {
        return <LeadersLoginSkeleton />;
    }

    return (
        <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Theme Toggle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="fixed top-4 right-4 z-50"
            >
                <ThemeToggle />
            </motion.div>

            {/* Login Form */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', damping: 20 }}
                className="relative z-10 w-full max-w-md px-6"
                style={{ padding: '10px' }}
            >
                <div className="glass rounded-3xl p-8 md:p-12">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                        className="flex justify-center mb-8"
                        style={{ padding: '7px' }}
                    >
                        <Image
                            src="/bandhannova-logo-final.svg"
                            alt="BandhanNova"
                            width={200}
                            height={80}
                        />
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <h1 className="h1 mb-3" style={{ color: 'var(--foreground)' }}>
                            Leaders <span className="gradient-text">Community Hub</span>
                        </h1>
                        <p className="body" style={{ color: 'var(--foreground-secondary)' }}>
                            Sign in to access the team communication hub
                        </p>
                    </motion.div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mb-6 p-4 rounded-2xl"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="small text-red-500">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Label htmlFor="email" className="body font-medium mb-2 block" style={{ color: 'var(--foreground)' }}>
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                    className="pl-12 pr-4 py-6 rounded-2xl glass border-transparent focus:border-purple-500 text-base"
                                    style={{
                                        color: 'var(--foreground)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Password */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{ paddingBottom: '16px' }}
                        >
                            <Label htmlFor="password" className="body font-medium mb-2 block" style={{ color: 'var(--foreground)' }}>
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="pl-12 pr-4 py-6 rounded-2xl glass border-transparent focus:border-purple-500 text-base"
                                    style={{
                                        color: 'var(--foreground)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 rounded-2xl font-bold text-lg text-white transition-all"
                                style={{ background: loading ? 'var(--foreground-tertiary)' : 'var(--gradient-hero)' }}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Footer Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <p className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                            Access restricted to authorized leaders and developers only
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </main>
    );
}
