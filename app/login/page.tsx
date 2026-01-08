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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { signIn } from '@/lib/auth-simple';
import { hasUserPreferences, saveUserPreferences } from '@/lib/localization/contextBuilder';
import { getAllLanguages } from '@/lib/localization/languages';
import { getAllCountries } from '@/lib/localization/countries';
import { createSession } from '@/lib/auth/session';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showPreferenceModal, setShowPreferenceModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [pendingUser, setPendingUser] = useState<any>(null);

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

                // Check if user has set language/country preferences
                if (!hasUserPreferences()) {
                    // Show preference modal
                    setPendingUser(user);
                    setShowPreferenceModal(true);
                } else {
                    // Create session and redirect
                    createSession({
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName || user.email
                    });
                    router.push('/dashboard');
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
            <div className="relative z-10 w-full" style={{ padding: '48px 32px' }}>
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

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="body" style={{ color: 'var(--foreground)' }}>
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
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
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
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
                                                <EyeOff className="w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
                                            ) : (
                                                <Eye className="w-5 h-5" style={{ color: 'var(--foreground-tertiary)' }} />
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
                                className="w-50 h-12 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 px-8"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'var(--foreground)'
                                }}
                            >
                                ← Back to Home
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Preference Selection Modal */}
            <Dialog open={showPreferenceModal} onOpenChange={setShowPreferenceModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Welcome! 🎉</DialogTitle>
                        <DialogDescription>
                            Let's personalize your AI experience. Select your country and preferred language.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Country Selector */}
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAllCountries().map((country) => (
                                        <SelectItem key={country.code} value={country.code}>
                                            {country.flag} {country.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Language Selector */}
                        <div className="space-y-2">
                            <Label htmlFor="language">Preferred Language</Label>
                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAllLanguages().map((lang) => (
                                        <SelectItem key={lang.code} value={lang.code}>
                                            {lang.icon} {lang.nativeName} ({lang.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={() => {
                                if (selectedCountry && selectedLanguage) {
                                    // Save preferences
                                    saveUserPreferences(selectedLanguage, selectedCountry);

                                    // Create session
                                    if (pendingUser) {
                                        createSession({
                                            id: pendingUser.id,
                                            email: pendingUser.email,
                                            fullName: pendingUser.email
                                        });
                                    }

                                    // Close modal and redirect
                                    setShowPreferenceModal(false);
                                    router.push('/dashboard');
                                }
                            }}
                            disabled={!selectedCountry || !selectedLanguage}
                            className="w-full"
                        >
                            Continue to Dashboard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
