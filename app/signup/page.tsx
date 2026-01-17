'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle, User, Check, X } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signUp } from '@/lib/auth-simple';

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
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

    // Password strength calculation
    const getPasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (pwd.length >= 12) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z\d]/.test(pwd)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const getStrengthLabel = () => {
        if (passwordStrength === 0) return '';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 3) return 'Medium';
        return 'Strong';
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 2) return '#EF4444';
        if (passwordStrength <= 3) return '#F59E0B';
        return '#10B981';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate inputs
            if (!fullName || !email || !password || !confirmPassword) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }

            // Name validation
            if (fullName.trim().length < 2) {
                setError('Please enter your full name');
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

            // Password validation
            if (password.length < 8) {
                setError('Password must be at least 8 characters long');
                setLoading(false);
                return;
            }

            // Password match validation
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                setLoading(false);
                return;
            }

            // Terms validation
            if (!agreeToTerms) {
                setError('Please agree to the Terms & Conditions');
                setLoading(false);
                return;
            }

            // Sign up
            const { user, error: signUpError } = await signUp({
                email,
                password,
                fullName: fullName.trim(),
            });

            if (signUpError) {
                setError(signUpError);
                setLoading(false);
                return;
            }

            if (user) {
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
            setError(err.message || 'An error occurred during signup');
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
            <div className="relative z-10 w-full" style={{ padding: '48px 24px' }}>
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

                    {/* Signup Card */}
                    <Card className="glass-strong border-0" style={{ padding: '32px' }}>
                        <CardHeader style={{ padding: '0 0 24px 0' }}>
                            <CardTitle className="h1 text-center" style={{ color: 'var(--foreground)', marginBottom: '8px' }}>
                                Create Your Account
                            </CardTitle>
                            <CardDescription className="body text-center" style={{ color: 'var(--foreground-secondary)' }}>
                                Start your AI-powered journey today
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

                                {/* Full Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="body" style={{ color: 'var(--foreground)' }}>
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="Your Name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
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
                                            placeholder={isSmallScreen ? "Password..." : "Create a strong password"}
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

                                    {/* Password Strength Indicator */}
                                    {password && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                                                    <div
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${(passwordStrength / 5) * 100}%`,
                                                            background: getStrengthColor()
                                                        }}
                                                    />
                                                </div>
                                                <span className="small font-medium" style={{ color: getStrengthColor() }}>
                                                    {getStrengthLabel()}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {password.length >= 8 ? (
                                                        <Check className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <X className="w-3 h-3 text-red-500" />
                                                    )}
                                                    <span className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                                        At least 8 characters
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/[a-z]/.test(password) && /[A-Z]/.test(password) ? (
                                                        <Check className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <X className="w-3 h-3 text-red-500" />
                                                    )}
                                                    <span className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                                        Uppercase & lowercase letters
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/\d/.test(password) ? (
                                                        <Check className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <X className="w-3 h-3 text-red-500" />
                                                    )}
                                                    <span className="small" style={{ color: 'var(--foreground-tertiary)' }}>
                                                        At least one number
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="body" style={{ color: 'var(--foreground)' }}>
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder={isSmallScreen ? "Confirm..." : "Confirm your password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                            ) : (
                                                <Eye className="w-5 h-5 auth-icon" style={{ color: 'var(--foreground-secondary)' }} />
                                            )}
                                        </button>
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="small text-red-500 flex items-center gap-1">
                                            <X className="w-3 h-3" />
                                            Passwords do not match
                                        </p>
                                    )}
                                    {confirmPassword && password === confirmPassword && (
                                        <p className="small text-green-500 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            Passwords match
                                        </p>
                                    )}
                                </div>

                                {/* Terms & Conditions */}
                                <div className="flex items-start gap-3" style={{ marginTop: '16px' }}>
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                        disabled={loading}
                                        className="mt-1 cursor-pointer"
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            minWidth: '18px',
                                            minHeight: '18px',
                                        }}
                                    />
                                    <Label htmlFor="terms" className="small cursor-pointer flex-1" style={{ color: 'var(--foreground-secondary)', lineHeight: '1.6' }}>
                                        I agree to the{' '}
                                        <Link href="/terms" className="hover:underline" style={{ color: 'var(--primary-purple)' }}>
                                            Terms & Conditions
                                        </Link>
                                        {' '}and{' '}
                                        <Link href="/privacy" className="hover:underline" style={{ color: 'var(--primary-purple)' }}>
                                            Privacy Policy
                                        </Link>
                                    </Label>
                                </div>

                                {/* Sign Up Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                                    style={{ background: 'var(--gradient-hero)', marginTop: '24px' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 justify-center">
                                            Create Account
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>


                            </form>
                        </CardContent>

                        <CardFooter style={{ padding: '24px 0 0 0' }}>
                            <p className="body text-center w-full" style={{ color: 'var(--foreground-secondary)' }}>
                                Already have an account?{' '}
                                <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--primary-purple)' }}>
                                    Sign in
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
