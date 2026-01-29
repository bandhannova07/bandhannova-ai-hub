'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from '@/lib/auth-simple';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Detect small screen
    useEffect(() => {
        const checkScreen = () => setIsSmallScreen(window.innerWidth <= 400);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate inputs
            if (!email || !password) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address');
                setLoading(false);
                return;
            }

            // Sign in
            const { user, error: signInError } = await signIn(email, password);

            if (signInError) {
                setError(signInError);
                setLoading(false);
                return;
            }

            if (user) {
                // Store remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Check if app is installed
                const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                    window.matchMedia('(display-mode: fullscreen)').matches ||
                    (window.navigator as any).standalone === true;

                // Check if user has already seen/skipped install prompt
                const installPromptShown = localStorage.getItem('installPromptShown');

                // Redirect based on install status
                if (isInstalled || installPromptShown === 'accepted' || installPromptShown === 'skipped') {
                    // App is installed or user already decided, go to dashboard
                    router.push('/dashboard');
                } else {
                    // Browser user, show install prompt
                    router.push('/install');
                }
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
            setLoading(false);
        }
    };



    return (
        <main className="relative min-h-screen overflow-hidden flex items-center justify-center">
            {/* Particle Background */}
            <ParticleBackground />

            {/* Gradient Mesh Background */}
            <div
                className="fixed inset-0 opacity-30"
                style={{ background: 'var(--gradient-mesh)' }}
            />

            {/* Main Content */}
            <div className="relative z-10 w-full" style={{ padding: '48px 4px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto max-w-md"
                >
                    {/* Logo */}
                    <div className="flex justify-center mb-12">
                        <Link href="/">
                            <Image
                                src="/bandhannova-logo-final.svg"
                                alt="BandhanNova Logo"
                                width={350}
                                height={350}
                                className="cursor-pointer hover:scale-105 transition-transform"
                                style={{ padding: '20px' }}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Login Card */}
                    <Card className="glass-strong border-0" style={{ padding: '32px' }}>
                        <CardHeader style={{ padding: '0 0 24px 0' }}>
                            <CardTitle className="h1 text-center" style={{ color: 'var(--foreground)', marginBottom: '8px' }}>
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="body text-center" style={{ color: 'var(--foreground-secondary)' }}>
                                Sign in to continue your AI journey
                            </CardDescription>
                        </CardHeader>

                        <CardContent style={{ padding: '0' }}>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 p-3 rounded-lg"
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                                    >
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        <p className="small text-red-500">{error}</p>
                                    </motion.div>
                                )}

                                {/* Google Sign In - Premium Design */}
                                <div className="relative group" style={{ padding: '10px' }}>
                                    <div
                                        className="absolute -inset-0.5 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-300"
                                    />
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            setLoading(true);
                                            const { signInWithGoogle } = await import('@/lib/auth-simple');
                                            await signInWithGoogle();
                                        }}
                                        variant="outline"
                                        className="relative w-full h-14 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 mb-6 overflow-hidden"
                                        style={{
                                            background: 'var(--card)',
                                            border: 'none',
                                            color: 'var(--foreground)'
                                        }}
                                        disabled={loading}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <Image
                                            src="/google-icon-logo-svgrepo-com.svg"
                                            alt="Google"
                                            width={24}
                                            height={24}
                                            className="relative z-10"
                                        />
                                        <span className="relative z-10 text-base">Continue with Google</span>
                                    </Button>
                                </div>

                                <div className="relative flex items-center justify-center mb-6">
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span style={{ color: 'var(--foreground-tertiary)', fontWeight: '500' }}>
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="body" style={{ color: 'var(--foreground)' }}>
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 body"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'var(--foreground)'
                                            }}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="body" style={{ color: 'var(--foreground)' }}>
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder={isSmallScreen ? "Password..." : "Enter your password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10 h-12 body"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'var(--foreground)'
                                            }}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                            ) : (
                                                <Eye className="w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Forgot Password */}
                                <div className="flex justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="small hover:underline"
                                        style={{ color: 'var(--primary-purple)', marginTop: '5px' }}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Sign In Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                                    style={{ background: 'var(--gradient-hero)', marginTop: '24px' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Signing in...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 justify-center">
                                            Sign In
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>


                            </form>
                        </CardContent>

                        <CardFooter style={{ padding: '24px 0 0 0' }}>
                            <p className="body text-center w-full" style={{ color: 'var(--foreground-secondary)' }}>
                                Don't have an account?{' '}
                                <Link href="/signup" className="font-semibold hover:underline" style={{ color: 'var(--primary-purple)' }}>
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>

                    {/* Back to Home */}
                    <div className="flex flex items-center justify-center mt-8" style={{ padding: '20px' }}>
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-50 h-12 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 px-8 auth-back-button"
                                style={{
                                    color: 'var(--foreground)'
                                }}
                            >
                                ← Back to Home
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
